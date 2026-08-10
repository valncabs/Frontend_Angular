import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { COLOMBIA_DEPARTMENTS } from '../../../core/services/colombia-locations';
import { loadExternalScript, loadExternalStylesheet } from '../../../core/utils/external-scripts';

declare const L: any;

export interface PickedLocation {
  lat: number;
  lng: number;
  address?: string;
  /** Etiqueta del departamento resuelto por el reverse geocoder (ej. "Antioquia"). */
  department?: string;
  /** Etiqueta de la ciudad/municipio resuelto por el reverse geocoder (ej. "Andes"). */
  city?: string;
}

/**
 * Selector de ubicación reutilizable basado en Leaflet + OSM.
 *
 * Flujo libre de costos, sin API keys:
 *  1. El usuario conoce la dirección → busca en Photon (OSM, gratis, sin clave).
 *  2. El usuario está físicamente en el lugar → botón "Mi ubicación" (GPS).
 *  3. Ninguno es lo suficientemente preciso → arrastra el pin sobre el mapa.
 *
 * Geocoder: Photon (photon.komoot.io) como primario — con mejor precisión a
 * nivel de casa en reverse — y Nominatim como respaldo si Photon falla o no
 * devuelve resultados. Ambos son gratuitos y sin límite duro de uso.
 *
 * El componente no conoce reglas de negocio: solo emite coordenadas (y una
 * dirección sugerida si el geocoder la resuelve). El consumidor decide qué
 * hacer con esos datos.
 */
@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-picker.html',
})
export class LocationPickerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  /** Coordenadas iniciales (modo edición). Si son null, se usa un centro por defecto. */
  @Input() initialLat: number | null = null;
  @Input() initialLng: number | null = null;

  /** Código ISO de país para acotar el autocompletado (Colombia por defecto). */
  @Input() countryCode = 'co';

  @Output() locationPicked = new EventEmitter<PickedLocation>();

  mapReady = signal(false);
  mapLoadError = signal(false);
  locatingUser = signal(false);
  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  searching = signal(false);
  coords = signal<{ lat: number; lng: number } | null>(null);
  geoError = signal('');

  private map: any = null;
  private marker: any = null;
  private searchDebounce: any = null;
  private suppressSearchSync = false;
  private viewInitialized = false;
  /** Centro pendiente (ciudad elegida en el select) si el mapa aún no carga. */
  private pendingCenter: [number, number] | null = null;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.loadLeafletAndInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Permite que el padre setee lat/lng después de que el mapa ya se inicializó
    // (por ejemplo, cuando los datos de edición llegan de forma asíncrona).
    if (!this.viewInitialized || !this.map) return;

    if ((changes['initialLat'] || changes['initialLng']) && this.initialLat && this.initialLng) {
      this.map.setView([this.initialLat, this.initialLng], 15);
      this.setLocation(this.initialLat, this.initialLng, false);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
  }

  private async loadLeafletAndInit(): Promise<void> {
    if (typeof L === 'undefined') {
      loadExternalStylesheet('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
      try {
        await loadExternalScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
      } catch {
        // CDN caído o bloqueado: mostrar el error en vez de un spinner infinito.
        this.mapLoadError.set(true);
        return;
      }
    }
    this.initMap();
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) return;

    const startLat = this.initialLat ?? 4.711;
    const startLng = this.initialLng ?? -74.0721;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [startLat, startLng],
      zoom: this.initialLat ? 15 : 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.setLocation(e.latlng.lat, e.latlng.lng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    if (this.pendingCenter) {
      this.map.setView(this.pendingCenter, 13);
      this.pendingCenter = null;
    } else if (this.initialLat && this.initialLng) {
      this.setLocation(this.initialLat, this.initialLng, false);
    }

    this.mapReady.set(true);
  }

  /**
   * Centra el mapa en una ciudad/departamento (elegidos en el select del
   * formulario) para que la "última ubicación conocida" coincida con lo que
   * muestra el mapa. No coloca un pin: el usuario confirma el punto exacto
   * después con búsqueda, GPS o arrastre.
   */
  async centerOn(cityLabel: string, departmentLabel: string): Promise<void> {
    const query = `${cityLabel}, ${departmentLabel}, Colombia`;
    const coords = await this.resolveCityCoords(query);
    if (!coords) return;

    if (this.map) {
      this.map.setView(coords, 13);
      this.clearSelection();
    } else {
      this.pendingCenter = coords;
    }
  }

  /** Limpia el pin y el campo de búsqueda (el consumidor ya reseteó sus datos). */
  reset(): void {
    this.clearSelection();
  }

  private async resolveCityCoords(query: string): Promise<[number, number] | null> {
    try {
      const params = new URLSearchParams({ q: query, limit: '1' });
      const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const f = data?.features?.[0];
        if (f) {
          const [lon, lat] = f.geometry.coordinates;
          return [lat, lon];
        }
      }
    } catch {
      // Se intenta con Nominatim.
    }

    try {
      const params = new URLSearchParams({
        format: 'json',
        q: query,
        limit: '1',
        countrycodes: 'co',
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
      const data = await res.json();
      const r = data?.[0];
      if (r) return [parseFloat(r.lat), parseFloat(r.lon)];
    } catch {
      // Silencioso: si ambos fallan, el mapa conserva su vista actual.
    }

    return null;
  }

  private clearSelection(): void {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    this.coords.set(null);
    this.suppressSearchSync = true;
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.geoError.set('');
  }

  /** Paso 2: GPS. Localiza al usuario con alta precisión y coloca el pin. */
  locateUser(): void {
    if (!navigator.geolocation) {
      this.geoError.set('Tu navegador no soporta geolocalización.');
      return;
    }
    this.locatingUser.set(true);
    this.geoError.set('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.map?.setView([latitude, longitude], 16);
        this.setLocation(latitude, longitude, false);
        this.reverseGeocode(latitude, longitude);
        this.locatingUser.set(false);
        this.geoError.set('');
      },
      (err) => {
        this.locatingUser.set(false);
        this.geoError.set(
          err.code === 1
            ? 'Permiso de ubicación denegado. Usa el buscador o toca el mapa.'
            : 'No pudimos obtener tu ubicación. Usa el buscador o toca el mapa.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  /** Paso 3: pin arrastrable. Mueve el marcador y emite la nueva posición. */
  private setLocation(lat: number, lng: number, syncSearchField = true): void {
    this.coords.set({ lat, lng });

    if (syncSearchField) {
      this.suppressSearchSync = true;
      this.searchQuery.set('');
    }

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      const icon = L.divIcon({
        html: `<div style="
          width:36px;height:36px;border-radius:50% 50% 50% 0;
          background:#2A9D8F;border:3px solid white;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        className: '',
      });
      this.marker = L.marker([lat, lng], { icon, draggable: true }).addTo(this.map);
      this.marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng();
        this.setLocation(pos.lat, pos.lng);
        this.reverseGeocode(pos.lat, pos.lng);
      });
    }

    this.locationPicked.emit({ lat, lng });
  }

  // ---------- Geocodificación ----------
  // Photon (primario) + Nominatim (respaldo). Ambos gratuitos, sin clave.

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const photon = await this.reversePhoton(lat, lng);
      if (photon) {
        const resolvedAddress = this.buildAddress(photon.address, photon.display_name);
        if (resolvedAddress) {
          this.suppressSearchSync = true;
          this.searchQuery.set(resolvedAddress);
          this.locationPicked.emit({
            lat,
            lng,
            address: resolvedAddress,
            ...this.regionFrom(photon.address),
          });
          return;
        }
      }
    } catch {
      // Photon falló: se intenta con Nominatim.
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`,
      );
      const data = await res.json();
      if (data?.display_name) {
        const resolvedAddress = this.buildAddress(data.address, data.display_name);

        this.suppressSearchSync = true;
        this.searchQuery.set(resolvedAddress || data.display_name);

        this.locationPicked.emit({
          lat,
          lng,
          address: resolvedAddress || undefined,
          ...this.regionFrom(data.address),
        });
      }
    } catch {
      // Silencioso: si ambos fallan, el usuario conserva lat/lng del click.
    }
  }

  /** Extrae departamento y ciudad (etiquetas) del `address` estructurado. */
  private regionFrom(address?: any): { department?: string; city?: string } {
    if (!address) return {};
    const state = address.state ?? address.region ?? '';
    const city =
      address.city ?? address.town ?? address.village ?? address.municipality ?? address.county ?? '';
    return {
      ...(state ? { department: state } : {}),
      ...(city ? { city } : {}),
    };
  }

  private async reversePhoton(lat: number, lng: number): Promise<any | null> {
    const res = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
    if (!res.ok) throw new Error('Photon reverse no disponible');
    const data = await res.json();
    const feature = data?.features?.[0];
    return feature ? this.normalizePhoton(feature) : null;
  }

  private async searchPhoton(query: string, bias?: { lat: number; lng: number }): Promise<any[]> {
    const params = new URLSearchParams({ q: query, limit: '8' });
    if (bias) {
      params.set('lat', String(bias.lat));
      params.set('lon', String(bias.lng));
    }
    const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
    if (!res.ok) throw new Error('Photon search no disponible');
    const data = await res.json();
    return (data?.features ?? []).map((f: any) => this.normalizePhoton(f));
  }

  /**
   * Normaliza un feature de Photon al mismo contrato que usa el resto del
   * componente (el que antes llenaba Nominatim): lat/lon, display_name y un
   * objeto `address` estructurado para buildAddress().
   */
  private normalizePhoton(feature: any): any {
    const p = feature.properties ?? {};
    const coords = feature.geometry?.coordinates ?? [0, 0];
    const [lon, lat] = coords;

    const road = p.street || p.name || '';
    const house = p.housenumber || '';
    const street = road ? (house ? `${road} # ${house}` : road) : house;

    const city = p.city || p.county || p.locality || '';
    const parts = [
      p.name && p.name !== road && p.name !== house ? p.name : '',
      street,
      p.district,
      city,
      p.state,
    ].filter((x: string) => x && x.trim());

    return {
      place_id: `photon-${p.osm_type}-${p.osm_id}`,
      lat: String(lat),
      lon: String(lon),
      display_name: parts.join(', ') || p.name || 'Ubicación',
      addresstype: p.type ?? 'place',
      countrycode: (p.countrycode ?? '').toLowerCase(),
      address: {
        road: p.street || p.name,
        house_number: p.housenumber,
        suburb: p.district,
        city,
        state: p.state,
      },
    };
  }

  /**
   * Arma una dirección clara y legible a partir de los campos estructurados,
   * sin el país. Para direcciones colombianas reconstruye `Calle 9 # 9-28`
   * como vía + '#' + número, seguido de barrio/municipio/departamento.
   */
  private buildAddress(address?: any, displayName?: string): string {
    if (!address) {
      return (displayName || '').split(',').slice(0, 2).join(',').trim();
    }

    const road = address.road ?? address.pedestrian ?? '';
    const house = address.house_number ?? '';
    const street = road ? (house ? `${road} # ${house}` : road) : house;

    const suburb = address.suburb ?? address.neighbourhood ?? address.district ?? '';
    const city =
      address.city ?? address.town ?? address.village ?? address.municipality ?? '';
    const state = address.state ?? address.region ?? '';

    const parts = [street, suburb, city, state].filter((p) => p && p.trim());
    if (parts.length) return parts.join(', ');

    return (displayName || '').split(',').slice(0, 2).join(',').trim();
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);

    if (this.suppressSearchSync) {
      this.suppressSearchSync = false;
      return;
    }

    if (this.searchDebounce) clearTimeout(this.searchDebounce);

    if (!value.trim() || value.trim().length < 3) {
      this.searchResults.set([]);
      return;
    }

    this.searchDebounce = setTimeout(() => this.runAutocomplete(value), 400);
  }

  private async runAutocomplete(query: string): Promise<void> {
    this.searching.set(true);
    const bias = this.coords() ?? (this.initialLat ? { lat: this.initialLat, lng: this.initialLng! } : undefined);

    try {
      // Paso 1: Photon (texto libre + bias espacial a lo ya marcado).
      const results = await this.searchPhoton(query, bias);
      if (results.length) {
        this.applySearchRanking(results);
        return;
      }
    } catch {
      // Photon no disponible: se continúa con Nominatim.
    }

    try {
      // Paso 2 (respaldo): Nominatim, con búsqueda estructurada cuando el
      // usuario teclea vía + municipio/departamento de Colombia.
      const parsed = this.parseColombiaQuery(query);
      let url: string;
      if (parsed.street && (parsed.city || parsed.state)) {
        const params = new URLSearchParams({
          format: 'json',
          limit: '7',
          dedupe: '1',
          addressdetails: '1',
          'accept-language': 'es',
          countrycodes: 'co',
          street: parsed.street,
          country: 'Colombia',
        });
        if (parsed.city) params.set('city', parsed.city);
        if (parsed.state) params.set('state', parsed.state);
        url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
      } else {
        url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Colombia',
        )}&limit=7&dedupe=1&addressdetails=1&accept-language=es&countrycodes=${this.countryCode}`;
      }

      const res = await fetch(url);
      const raw: any[] = (await res.json()) ?? [];

      // Solo Colombia y prioriza edificios/direcciones sobre calles genéricas.
      const inColombia = raw.filter(
        (r) => !r.address?.country_code || r.address.country_code === 'co',
      );
      this.applySearchRanking(inColombia);
    } catch {
      this.searchResults.set([]);
    } finally {
      this.searching.set(false);
    }
  }

  /** Ordena los resultados: casas/edificios primero, Colombia por encima. */
  private applySearchRanking(results: any[]): void {
    const inColombia = results.filter(
      (r) => !r.countrycode || r.countrycode === 'co',
    );
    const rank = (r: any): number => {
      const t = (r.addresstype ?? r.type ?? '').toLowerCase();
      if (t === 'building' || t === 'house') return 0;
      if (t === 'address' || t === 'street' || t === 'amenity' || t === 'shop' || t === 'place') return 1;
      return 2;
    };
    this.searchResults.set([...inColombia].sort((a, b) => rank(a) - rank(b)));
  }

  /**
   * Detecta la vía ("Calle 9") y, si aparece, el municipio y departamento de
   * Colombia escritos en la consulta (usando el dataset local DIVIPOLA) para
   * armar la búsqueda estructurada de Nominatim (respaldo).
   */
  private parseColombiaQuery(query: string): { street?: string; city?: string; state?: string } {
    const streetMatch = query.trim().match(
      /^(calle|carrera|cra|cl|av|avenida|diagonal|transversal|tv|autopista|vía|via)\s+\d+[a-z]?/i,
    );
    const street = streetMatch ? this.titleCase(streetMatch[0]) : undefined;

    const lower = query.toLowerCase();
    for (const dept of COLOMBIA_DEPARTMENTS) {
      if (lower.includes(dept.label.toLowerCase())) {
        const city = dept.cities.find((c) =>
          lower.includes(c.label.toLowerCase()),
        );
        return {
          street,
          city: city?.label,
          state: dept.label,
        };
      }
    }
    return { street };
  }

  private titleCase(value: string): string {
    return value
      .split(' ')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
  }

  selectSearchResult(result: any): void {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const typedQuery = this.searchQuery();

    this.map?.setView([lat, lng], 16);
    this.setLocation(lat, lng, false);

    const resolvedAddress = this.enrichWithTypedNumber(
      this.buildAddress(result.address, result.display_name),
      typedQuery,
    );

    this.suppressSearchSync = true;
    this.searchQuery.set(resolvedAddress || result.display_name);
    this.searchResults.set([]);

    this.locationPicked.emit({
      lat,
      lng,
      address: resolvedAddress || undefined,
      ...this.regionFrom(result.address),
    });
  }

  /**
   * El geocoder (OSM) a menudo no tiene el número de casa registrado, así que
   * "Calle 9 # 9-28" se resuelve solo como "Calle 9". Si el usuario tecleó un
   * número (`# 9-28`) y ese número corresponde a la misma vía que resuelve el
   * geocoder, lo reincorporamos para no perder el dato exacto.
   */
  private enrichWithTypedNumber(address: string, typed: string): string {
    if (!typed) return address;
    const numMatch = typed.match(/#+\s*([\d]\s*[\d\s-]*\d)/);
    if (!numMatch) return address;
    const number = numMatch[1].trim().replace(/\s+/g, ' ');

    const first = address.split(',')[0].trim();
    if (!first || first.includes('#')) return address;

    const base = first.replace(/\s+/g, ' ').toLowerCase();
    if (!typed.toLowerCase().includes(base)) return address;

    return `${first} # ${number}${address.slice(first.length)}`;
  }

  get latLngDisplay(): string {
    const c = this.coords();
    if (!c) return '';
    return `${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}`;
  }
}
