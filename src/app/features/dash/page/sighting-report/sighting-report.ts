import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PetInputComponent } from '../../../../shared/components/imput-pets/imput-pets';
import { SelectOption } from '../../../../shared/components/select-pets/select-pets';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';

import { SightingReportDto, COLOMBIA_DEPARTMENTS } from './sighting-report-models';

declare const L: any;

@Component({
  selector: 'app-sighting-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PetInputComponent, PetButtonComponent],
  templateUrl: './sighting-report.html',
})
export class SightingReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private fb = inject(FormBuilder);
  private router = inject(Router);

  form!: FormGroup;
  submitting = signal(false);
  submitted = signal(false);
  locatingUser = signal(false);
  mapReady = signal(false);
  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  searching = signal(false);

  private map: any = null;
  private marker: any = null;
  private leafletLoaded = false;
  private searchDebounce: any = null;
  private suppressSearchSync = false;

  coords = signal<{ lat: number; lng: number } | null>(null);

  readonly statusOptions: SelectOption[] = [
    { value: 'SIGHTED', label: 'La vi / avistamiento' },
    { value: 'IN_POSSESSION', label: 'La tengo en posesión' },
  ];

  readonly departmentOptions: SelectOption[] = [
    { value: '', label: 'Selecciona un departamento' },
    ...COLOMBIA_DEPARTMENTS.map((d) => ({ value: d.value, label: d.label })),
  ];

  cityOptions = signal<SelectOption[]>([]);

  get departmentValue() {
    return this.form?.get('department')?.value ?? '';
  }
  set departmentValue(v: string) {
    this.form?.get('department')?.setValue(v);
    this.onDepartmentChange(v);
  }

  get cityValue() {
    return this.form?.get('city')?.value ?? '';
  }
  set cityValue(v: string) {
    this.form?.get('city')?.setValue(v);
  }

  get statusValue() {
    return this.form?.get('status')?.value ?? '';
  }
  set statusValue(v: string) {
    this.form?.get('status')?.setValue(v);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.loadLeafletAndInit();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: ['', Validators.required],
      sightingDate: ['', Validators.required],
      contactPhone: ['', [Validators.pattern(/^[0-9\s\+\-]{7,15}$/)]],
      department: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });
  }

  private async loadLeafletAndInit(): Promise<void> {
    if (typeof L !== 'undefined') {
      this.initMap();
      return;
    }

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

    this.initMap();
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) return;

    const defaultLat = 4.711;
    const defaultLng = -74.0721;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.setMapLocation(e.latlng.lat, e.latlng.lng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    this.mapReady.set(true);
    this.locateUser();
  }

  locateUser(): void {
    if (!navigator.geolocation) return;
    this.locatingUser.set(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.map?.setView([latitude, longitude], 15);
        this.setMapLocation(latitude, longitude, false);
        this.reverseGeocode(latitude, longitude);
        this.locatingUser.set(false);
      },
      () => {
        this.locatingUser.set(false);
      },
    );
  }

  private setMapLocation(lat: number, lng: number, syncSearchField = true): void {
    this.coords.set({ lat, lng });
    this.form.patchValue({ latitude: lat, longitude: lng });

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
        this.setMapLocation(pos.lat, pos.lng);
        this.reverseGeocode(pos.lat, pos.lng);
      });
    }
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
        if (shortAddress) this.form.patchValue({ address: shortAddress });

        this.suppressSearchSync = true;
        this.searchQuery.set(data.display_name);
      }
    } catch {}
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

    this.searchDebounce = setTimeout(() => {
      this.runAutocomplete(value);
    }, 400);
  }

  private async runAutocomplete(query: string): Promise<void> {
    this.searching.set(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Colombia')}&limit=5&addressdetails=1&accept-language=es&countrycodes=co`,
      );
      const data = await res.json();
      this.searchResults.set(data ?? []);
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
    this.setMapLocation(lat, lng, false);
    this.form.patchValue({ address: result.display_name.split(',')[0] });

    this.suppressSearchSync = true;
    this.searchQuery.set(result.display_name);
    this.searchResults.set([]);
  }

  onDepartmentChange(deptValue: string): void {
    const dept = COLOMBIA_DEPARTMENTS.find((d) => d.value === deptValue);
    if (dept) {
      this.cityOptions.set([{ value: '', label: 'Selecciona una ciudad' }, ...dept.cities]);
    } else {
      this.cityOptions.set([]);
    }
    this.form.get('city')?.setValue('');
  }

  hasError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required']) return 'Este campo es obligatorio';
    if (c.errors['maxlength']) return 'Máximo de caracteres excedido';
    if (c.errors['pattern']) return 'Formato de teléfono inválido';
    return 'Valor inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const payload: SightingReportDto = { ...this.form.value };

    setTimeout(() => {
      console.log('Reporte enviado:', payload);
      this.submitting.set(false);
      this.submitted.set(true);
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/reportes']);
  }

  get latLngDisplay(): string {
    const c = this.coords();
    if (!c) return '';
    return `${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}`;
  }
}
