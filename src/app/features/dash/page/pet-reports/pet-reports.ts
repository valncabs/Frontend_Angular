import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { PetSelectComponent, SelectOption } from '../../components/select-pets/select-pets';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { PetReport, ReportFilters, ReportType, COLOMBIAN_CITIES } from './report-models';

const MOCK_REPORTS: PetReport[] = [
  {
    id: 'r-1',
    type: 'LOST',
    petName: 'Max',
    species: 'Perro',
    speciesId: 'sp-1',
    breed: 'Labrador Retriever',
    sex: 'MALE',
    color: 'Dorado',
    size: 'LARGE',
    approximateAge: 3,
    distinctiveMarks: 'Collar azul con placa de identificación',
    description: 'Se perdió cerca del parque El Virrey. Es muy amigable y obedece a su nombre.',
    reporterName: 'Carlos Mejía',
    reporterPhone: '310 456 7890',
    city: 'bogota',
    neighborhood: 'Chico Norte',
    address: 'Cra 15 # 88-20',
    reportedAt: '2025-06-10T14:30:00',
    lastSeenAt: '2025-06-10T08:00:00',
  },
  {
    id: 'r-2',
    type: 'FOUND',
    species: 'Gato',
    speciesId: 'sp-2',
    breed: 'Siamés',
    sex: 'FEMALE',
    color: 'Crema con puntos oscuros',
    size: 'SMALL',
    approximateAge: 2,
    description:
      'Encontrada deambulando sola. Está en buen estado y parece estar acostumbrada a vivir en casa.',
    reporterName: 'Laura Gómez',
    reporterPhone: '315 789 0123',
    city: 'medellin',
    neighborhood: 'El Poblado',
    reportedAt: '2025-06-11T09:15:00',
  },
  {
    id: 'r-3',
    type: 'LOST',
    petName: 'Luna',
    species: 'Gato',
    speciesId: 'sp-2',
    sex: 'FEMALE',
    color: 'Negra con mancha blanca en el pecho',
    size: 'MEDIUM',
    approximateAge: 5,
    distinctiveMarks: 'Ojos verdes, usa collar rojo',
    description: 'Gata muy cariñosa. Se escapó cuando abrieron la puerta.',
    reporterName: 'Ana Torres',
    reporterPhone: '320 111 2233',
    city: 'barranquilla',
    neighborhood: 'Alto Prado',
    reportedAt: '2025-06-12T18:00:00',
    lastSeenAt: '2025-06-12T17:30:00',
  },
  {
    id: 'r-4',
    type: 'FOUND',
    species: 'Perro',
    speciesId: 'sp-1',
    breed: 'Pastor Alemán',
    sex: 'MALE',
    color: 'Negro y café',
    size: 'LARGE',
    approximateAge: 4,
    distinctiveMarks: 'Sin collar, cicatriz pequeña en la pata delantera izquierda',
    description:
      'Encontrado cerca del Terminal de Transporte. Parece asustado pero no es agresivo.',
    reporterName: 'Pedro Ruiz',
    city: 'cali',
    reportedAt: '2025-06-09T11:45:00',
  },
  {
    id: 'r-5',
    type: 'LOST',
    petName: 'Coco',
    species: 'Ave',
    speciesId: 'sp-3',
    color: 'Verde con pico amarillo',
    approximateAge: 1,
    description:
      'Loro pequeño que habla. Dice "Coco quiere agua" y "hola". Se escapó por la ventana.',
    reporterName: 'Sofía Herrera',
    reporterPhone: '313 567 8901',
    city: 'barranquilla',
    neighborhood: 'Riomar',
    reportedAt: '2025-06-13T07:30:00',
    lastSeenAt: '2025-06-13T07:00:00',
  },
  {
    id: 'r-6',
    type: 'FOUND',
    species: 'Perro',
    speciesId: 'sp-1',
    color: 'Blanco con manchas cafés',
    size: 'SMALL',
    description:
      'Perrita encontrada en el parque. Muy tranquila y limpia, probablemente tiene dueño.',
    reporterName: 'Miguel Sánchez',
    reporterPhone: '318 234 5678',
    city: 'bogota',
    neighborhood: 'Usaquén',
    reportedAt: '2025-06-13T16:20:00',
  },
];

@Component({
  selector: 'app-pet-reports',
  standalone: true,
  imports: [CommonModule, PetButtonComponent, PetSelectComponent, ModalComponent, FormsModule],
  templateUrl: './pet-reports.html',
})
export class PetReportsComponent implements OnInit {
  private router = inject(Router);

  get filterTypeValue() {
    return this.filterType();
  }
  set filterTypeValue(v: string) {
    this.filterType.set(v);
  }

  get filterSpeciesValue() {
    return this.filterSpecies();
  }
  set filterSpeciesValue(v: string) {
    this.filterSpecies.set(v);
  }

  get filterCityValue() {
    return this.filterCity();
  }
  set filterCityValue(v: string) {
    this.filterCity.set(v);
    this.locationError.set('');
  }
  reports = signal<PetReport[]>(MOCK_REPORTS);
  filters = signal<ReportFilters>({ type: 'ALL', speciesId: '', city: '' });
  selectedReport = signal<PetReport | null>(null);
  loadingLocation = signal(false);
  locationError = signal('');

  readonly typeOptions: SelectOption[] = [
    { value: 'ALL', label: 'Todos los reportes' },
    { value: 'LOST', label: 'Mascotas perdidas' },
    { value: 'FOUND', label: 'Mascotas encontradas' },
  ];

  readonly speciesOptions: SelectOption[] = [
    { value: '', label: 'Todas las especies' },
    { value: 'sp-1', label: 'Perro' },
    { value: 'sp-2', label: 'Gato' },
    { value: 'sp-3', label: 'Ave' },
    { value: 'sp-4', label: 'Conejo' },
    { value: 'sp-5', label: 'Reptil' },
  ];

  get cityOptions(): SelectOption[] {
    return [
      { value: '', label: 'Todas las ciudades' },
      ...COLOMBIAN_CITIES.map((c) => ({ value: c.value, label: c.label })),
    ];
  }

  readonly speciesEmoji: Record<string, string> = {
    Perro: '🐶',
    Gato: '🐱',
    Ave: '🐦',
  };

  readonly sexLabel: Record<string, string> = {
    MALE: 'Macho',
    FEMALE: 'Hembra',
  };

  readonly sizeLabel: Record<string, string> = {
    SMALL: 'Pequeño',
    MEDIUM: 'Mediano',
    LARGE: 'Grande',
    EXTRA_LARGE: 'Extra grande',
  };
  filterType = signal('ALL');
  filterSpecies = signal('');
  filterCity = signal('');

  filteredReports = computed(() => {
    return this.reports().filter((r) => {
      if (this.filterType() !== 'ALL' && r.type !== this.filterType()) return false;
      if (this.filterSpecies() && r.speciesId !== this.filterSpecies()) return false;
      if (this.filterCity() && r.city !== this.filterCity()) return false;
      return true;
    });
  });

  lostCount = computed(() => this.filteredReports().filter((r) => r.type === 'LOST').length);
  foundCount = computed(() => this.filteredReports().filter((r) => r.type === 'FOUND').length);

  ngOnInit(): void {
    this.requestUserLocation();
  }

  requestUserLocation(): void {
    if (!navigator.geolocation) return;
    this.loadingLocation.set(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const city = this.detectCityFromCoords(latitude, longitude);
        if (city) {
          this.filters.update((f) => ({ ...f, city }));
        }
        this.loadingLocation.set(false);
      },
      () => {
        this.locationError.set('No se pudo obtener tu ubicación');
        this.loadingLocation.set(false);
      },
    );
  }

  private detectCityFromCoords(lat: number, lng: number): string {
    const cities: { city: string; lat: number; lng: number }[] = [
      { city: 'bogota', lat: 4.711, lng: -74.0721 },
      { city: 'medellin', lat: 6.2442, lng: -75.5812 },
      { city: 'cali', lat: 3.4516, lng: -76.532 },
      { city: 'barranquilla', lat: 10.9685, lng: -74.7813 },
      { city: 'cartagena', lat: 10.391, lng: -75.4794 },
    ];

    let nearest = '';
    let minDist = Infinity;
    for (const c of cities) {
      const d = Math.sqrt(Math.pow(lat - c.lat, 2) + Math.pow(lng - c.lng, 2));
      if (d < minDist) {
        minDist = d;
        nearest = c.city;
      }
    }
    return minDist < 1.5 ? nearest : '';
  }

  onTypeFilter(value: string): void {
    this.filters.update((f) => ({ ...f, type: value as ReportType | 'ALL' }));
  }

  onSpeciesFilter(value: string): void {
    this.filters.update((f) => ({ ...f, speciesId: value }));
  }

  onCityFilter(value: string): void {
    this.filters.update((f) => ({ ...f, city: value }));
  }

  openDetail(report: PetReport): void {
    this.selectedReport.set(report);
  }

  closeDetail(): void {
    this.selectedReport.set(null);
  }

  getEmoji(speciesName?: string): string {
    if (!speciesName) return this.speciesEmoji['default'];
    return this.speciesEmoji[speciesName] ?? this.speciesEmoji['default'];
  }

  getCityLabel(value: string): string {
    return COLOMBIAN_CITIES.find((c) => c.value === value)?.label ?? value;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('es-CO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  navigateToReport(): void {
    this.router.navigate(['/reportar']);
  }
}
