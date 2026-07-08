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

declare const L: any;

export interface PickedLocation {
  lat: number;
  lng: number;
  address?: string;
}

/**
 * Selector de ubicación reutilizable basado en Leaflet + Nominatim.
 * No conoce reglas de negocio: solo emite coordenadas (y una dirección
 * sugerida, si Nominatim la resuelve). El formulario consumidor decide
 * qué hacer con esos datos (p. ej. patchear un FormGroup).
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
  locatingUser = signal(false);
  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  searching = signal(false);
  coords = signal<{ lat: number; lng: number } | null>(null);

  private map: any = null;
  private marker: any = null;
  private searchDebounce: any = null;
  private suppressSearchSync = false;
  private viewInitialized = false;

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
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(cssLink);

      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
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

    if (this.initialLat && this.initialLng) {
      this.setLocation(this.initialLat, this.initialLng, false);
    }

    this.mapReady.set(true);
  }

  locateUser(): void {
    if (!navigator.geolocation) return;
    this.locatingUser.set(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.map?.setView([latitude, longitude], 15);
        this.setLocation(latitude, longitude, false);
        this.reverseGeocode(latitude, longitude);
        this.locatingUser.set(false);
      },
      () => this.locatingUser.set(false),
    );
  }

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

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`,
      );
      const data = await res.json();
      if (data?.display_name) {
        const addr = data.address;
        const street = addr.road ?? addr.pedestrian ?? '';
        const number = addr.house_number ?? '';
        const shortAddress = [street, number].filter(Boolean).join(' ');

        this.suppressSearchSync = true;
        this.searchQuery.set(data.display_name);

        this.locationPicked.emit({ lat, lng, address: shortAddress || undefined });
      }
    } catch {
      // Silencioso: si Nominatim falla, el usuario igual conserva lat/lng del click.
    }
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
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Colombia',
        )}&limit=5&addressdetails=1&accept-language=es&countrycodes=${this.countryCode}`,
      );
      this.searchResults.set((await res.json()) ?? []);
    } catch {
      this.searchResults.set([]);
    } finally {
      this.searching.set(false);
    }
  }

  selectSearchResult(result: any): void {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    this.map?.setView([lat, lng], 16);
    this.setLocation(lat, lng, false);

    this.suppressSearchSync = true;
    this.searchQuery.set(result.display_name);
    this.searchResults.set([]);

    this.locationPicked.emit({
      lat,
      lng,
      address: result.display_name.split(',')[0],
    });
  }

  get latLngDisplay(): string {
    const c = this.coords();
    if (!c) return '';
    return `${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}`;
  }
}
