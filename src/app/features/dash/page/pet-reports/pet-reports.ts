import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { PetSelectComponent, SelectOption } from '../../components/select-pets/select-pets';
import { PetInputComponent } from '../../components/pet-input/pet-input';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { COLOMBIAN_CITIES } from './report-models';
import { ReportsFacade } from '../../../../core/services/reports';
import { CatalogService } from '../../../../core/services/catalog';
import { ProfileService } from '../../../../core/services/profile';
import { LostReportsService } from '../../../../core/services/lost-reports';
import { FoundReportsService } from '../../../../core/services/found-reports';
import { PetsService } from '../../../../core/services/pets';
import { AuthService } from '../../../../core/services/auth';
import { parseApiError } from '../../../../core/services/api-error';
import {
  FOUND_STATUS_LABELS,
  LOST_STATUS_LABELS,
  MyReportItem,
  UnifiedReportItem,
} from '../../../../core/services/report-models';
import { SpeciesResponse } from '../../../../core/services/pet.models';
import { LostReportResponse } from '../../../../core/services/lost-report-models';
import { FoundReportResponse } from '../../../../core/services/report-models';

type ReportDetail =
  | { kind: 'LOST'; data: LostReportResponse }
  | { kind: 'FOUND'; data: FoundReportResponse };

type Tab = 'ALL' | 'MINE';

@Component({
  selector: 'app-pet-reports',
  standalone: true,
  imports: [
    CommonModule,
    PetButtonComponent,
    PetSelectComponent,
    PetInputComponent,
    ModalComponent,
    ConfirmDialogComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pet-reports.html',
})
export class PetReportsComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private reportsFacade = inject(ReportsFacade);
  private catalogService = inject(CatalogService);
  private profileService = inject(ProfileService);
  private lostReportsService = inject(LostReportsService);
  private foundReportsService = inject(FoundReportsService);
  private petsService = inject(PetsService);
  private authService = inject(AuthService);

  activeTab = signal<Tab>('ALL');

  reports = signal<UnifiedReportItem[]>([]);
  myReports = signal<MyReportItem[]>([]);
  species = signal<SpeciesResponse[]>([]);
  isLoading = signal(false);
  generalError = signal<string | null>(null);

  selectedItem = signal<UnifiedReportItem | null>(null);
  selectedDetail = signal<ReportDetail | null>(null);
  loadingDetail = signal(false);

  currentUserId = computed(() => this.authService.currentUser()?.id ?? null);

  filterType = signal<'ALL' | 'LOST' | 'FOUND'>('ALL');
  filterSpecies = signal('');
  filterCity = signal('');

  // ---------- Confirmación: marcar como encontrada ----------
  reportToMarkAsFound = signal<MyReportItem | null>(null);

  // ---------- Confirmación: eliminar ----------
  reportToDelete = signal<MyReportItem | null>(null);

  // ---------- Avistamientos de un reporte de pérdida (modal grande) ----------
  sightingsModalOpen = signal(false);
  sightingsForReport = signal<MyReportItem | null>(null);
  sightings = signal<FoundReportResponse[]>([]);
  loadingSightings = signal(false);
  sightingActionError = signal<string | null>(null);

  openSightingsModal(item: MyReportItem): void {
    this.sightingsForReport.set(item);
    this.sightingsModalOpen.set(true);
    this.loadSightings(item.id);
  }

  closeSightingsModal(): void {
    this.sightingsModalOpen.set(false);
    this.sightingsForReport.set(null);
    this.sightings.set([]);
    this.sightingActionError.set(null);
  }
  sightingPhotos = signal<Record<string, string>>({});

  private loadSightings(lostReportId: string): void {
    this.loadingSightings.set(true);
    this.foundReportsService.listByLostReport(lostReportId).subscribe({
      next: (response) => {
        this.sightings.set(response.data);
        this.loadingSightings.set(false);
        this.loadSightingPhotos(response.data);
      },
      error: () => {
        this.sightingActionError.set('No pudimos cargar los avistamientos.');
        this.loadingSightings.set(false);
      },
    });
  }

  private loadSightingPhotos(sightings: FoundReportResponse[]): void {
    if (sightings.length === 0) return;

    const requests = sightings.map((s) =>
      this.foundReportsService.listImages(s.id).pipe(
        map((res) => {
          const images = res.data;
          const primary = images.find((img) => img.is_primary) ?? images[0];
          return { id: s.id, url: primary?.url };
        }),
        catchError(() => of({ id: s.id, url: undefined })),
      ),
    );

    forkJoin(requests).subscribe((results) => {
      const photoMap: Record<string, string> = {};
      results.forEach((r) => {
        if (r.url) photoMap[r.id] = r.url;
      });
      this.sightingPhotos.set(photoMap);
    });
  }

  sightingStatusLabel(status: string): string {
    return FOUND_STATUS_LABELS[status as keyof typeof FOUND_STATUS_LABELS] ?? status;
  }

  // ---------- Edición ----------
  editingReportItem = signal<MyReportItem | null>(null);
  savingEdit = signal(false);
  editGeneralError = signal<string | null>(null);
  editForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    contactPhone: [''],
    address: [''],
    date: ['', Validators.required],
    reward: [null],
  });

  get filterTypeValue() {
    return this.filterType();
  }
  set filterTypeValue(v: string) {
    this.filterType.set(v as 'ALL' | 'LOST' | 'FOUND');
    this.reload();
  }

  get filterSpeciesValue() {
    return this.filterSpecies();
  }
  set filterSpeciesValue(v: string) {
    this.filterSpecies.set(v);
    this.reload();
  }

  get filterCityValue() {
    return this.filterCity();
  }
  set filterCityValue(v: string) {
    this.filterCity.set(v);
    this.reload();
  }

  readonly typeOptions: SelectOption[] = [
    { value: 'ALL', label: 'Todos los reportes' },
    { value: 'LOST', label: 'Mascotas perdidas' },
    { value: 'FOUND', label: 'Mascotas encontradas' },
  ];

  get speciesOptions(): SelectOption[] {
    return [
      { value: '', label: 'Todas las especies' },
      ...this.species().map((s) => ({ value: s.id, label: s.name })),
    ];
  }

  get cityOptions(): SelectOption[] {
    return [
      { value: '', label: 'Todas las ciudades' },
      ...COLOMBIAN_CITIES.map((c) => ({ value: c.value, label: c.label })),
    ];
  }

  readonly speciesEmoji: Record<string, string> = { Perro: '🐶', Gato: '🐱', Ave: '🐦' };
  readonly sexLabel: Record<string, string> = {
    MALE: 'Macho',
    FEMALE: 'Hembra',
    UNKNOWN: 'No especificado',
  };
  readonly sizeLabel: Record<string, string> = {
    SMALL: 'Pequeño',
    MEDIUM: 'Mediano',
    LARGE: 'Grande',
  };

  lostCount = computed(() => this.reports().filter((r) => r.kind === 'LOST').length);
  foundCount = computed(() => this.reports().filter((r) => r.kind === 'FOUND').length);

  ngOnInit(): void {
    this.catalogService.listSpecies().subscribe({
      next: (response) => this.species.set(response.data),
      error: () => {},
    });

    this.loadDefaultCityFromProfile();
  }

  switchTab(tab: Tab): void {
    this.activeTab.set(tab);
    if (tab === 'MINE') {
      this.loadMyReports();
    } else {
      this.reload();
    }
  }

  private refreshAllLists(): void {
    this.reload();
    this.loadMyReports();
  }

  isResolved(item: UnifiedReportItem | MyReportItem): boolean {
    return item.kind === 'LOST' && (item.status === 'FOUND' || item.status === 'Encontrada');
  }

  isOwnReport(item: UnifiedReportItem): boolean {
    return item.createdBy === this.currentUserId();
  }

  private loadDefaultCityFromProfile(): void {
    this.isLoading.set(true);
    this.profileService.getMyProfile().subscribe({
      next: (response) => {
        const city = this.matchCityValue(response.data.city);
        if (city) this.filterCity.set(city);
        this.reload();
      },
      error: () => this.reload(),
    });
  }

  private matchCityValue(cityName: string): string | null {
    const found = COLOMBIAN_CITIES.find((c) => c.label.toLowerCase() === cityName?.toLowerCase());
    return found?.value ?? null;
  }

  private reload(): void {
    this.isLoading.set(true);
    this.generalError.set(null);
    this.reportsFacade
      .listCombined({
        type: 'ALL',
        speciesId: this.filterSpecies() || undefined,
        city: this.filterCity() ? this.getCityLabel(this.filterCity()) : undefined,
      })
      .subscribe({
        next: (items) => {
          const filtered = this.applyClientFilters(items);
          this.reports.set(filtered);
          this.isLoading.set(false);
          this.attachPhotos(filtered, this.reports);
        },
        error: () => {
          this.generalError.set('No pudimos cargar los reportes.');
          this.isLoading.set(false);
        },
      });
  }

  private applyClientFilters(items: UnifiedReportItem[]): UnifiedReportItem[] {
    let result = items;

    const type = this.filterType();
    if (type === 'LOST') {
      result = result.filter((item) => item.kind === 'LOST' && !this.isResolved(item));
    } else if (type === 'FOUND') {
      result = result.filter((item) => item.kind === 'FOUND' || this.isResolved(item));
    }

    const speciesId = this.filterSpecies();
    if (speciesId) {
      result = result.filter((item) => item.kind === 'LOST' || item.speciesId === speciesId);
    }

    return result;
  }

  private attachPhotos(
    items: UnifiedReportItem[],
    target: typeof this.reports | typeof this.myReports,
  ): void {
    if (items.length === 0) return;

    const requests = items.map((item) => {
      if (item.kind === 'LOST') {
        if (!item.petId) return of(undefined);
        return this.petsService.listImages(item.petId).pipe(
          map((res) => {
            const images = res.data;
            const primary = images.find((img) => img.is_primary) ?? images[0];
            return primary?.url;
          }),
          catchError(() => of(undefined)),
        );
      }

      return this.foundReportsService.listImages(item.id).pipe(
        map((res) => {
          const images = res.data;
          const primary = images.find((img) => img.is_primary) ?? images[0];
          return primary?.url;
        }),
        catchError(() => of(undefined)),
      );
    });

    forkJoin(requests).subscribe((urls) => {
      (target as any).update((current: UnifiedReportItem[]) =>
        current.map((item, index) => (urls[index] ? { ...item, photoUrl: urls[index] } : item)),
      );
    });
  }

  private loadMyReports(): void {
    this.isLoading.set(true);

    forkJoin([
      this.lostReportsService.mine().pipe(catchError(() => of({ data: { items: [] } } as any))),
      this.foundReportsService.mine().pipe(catchError(() => of({ data: { items: [] } } as any))),
    ]).subscribe(([lostRes, foundRes]) => {
      const lostItems: MyReportItem[] = lostRes.data.items.map((item: any) => ({
        id: item.id,
        kind: 'LOST',
        title: item.title,
        status: LOST_STATUS_LABELS[item.status as keyof typeof LOST_STATUS_LABELS] ?? item.status,
        city: item.city,
        speciesId: null,
        petId: item.pet_id ?? null,
        date: item.lost_date,
        publishedAt: item.published_at,
        createdBy: item.created_by,
        canMarkAsFound: item.status === 'PUBLISHED',
      }));

      const foundItems: MyReportItem[] = foundRes.data.items.map((item: any) => ({
        id: item.id,
        kind: 'FOUND',
        title: item.title,
        status: FOUND_STATUS_LABELS[item.status as keyof typeof FOUND_STATUS_LABELS] ?? item.status,
        city: item.city,
        speciesId: item.species_id,
        petId: null,
        date: item.found_date,
        publishedAt: item.published_at,
        createdBy: item.created_by,
        canMarkAsFound: false,
      }));

      const combined = [...lostItems, ...foundItems].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt),
      );
      this.myReports.set(combined);
      this.isLoading.set(false);
      this.attachPhotos(combined, this.myReports);
    });
  }

  // ---------- Marcar como encontrada (con confirmación) ----------

  requestMarkAsFound(item: MyReportItem): void {
    this.reportToMarkAsFound.set(item);
  }

  confirmMarkAsFound(): void {
    const item = this.reportToMarkAsFound();
    if (!item) return;

    this.lostReportsService.markAsFound(item.id).subscribe({
      next: () => {
        this.reportToMarkAsFound.set(null);
        this.refreshAllLists();
      },
      error: () => {
        this.generalError.set('No pudimos actualizar el estado del reporte.');
        this.reportToMarkAsFound.set(null);
      },
    });
  }

  cancelMarkAsFound(): void {
    this.reportToMarkAsFound.set(null);
  }

  markAsMatch(sighting: FoundReportResponse): void {
    this.foundReportsService.match(sighting.id).subscribe({
      next: () => {
        this.loadSightings(this.sightingsForReport()!.id);
        this.refreshAllLists();
      },
      error: () => this.sightingActionError.set('No pudimos marcar la coincidencia.'),
    });
  }

  unmatchSighting(sighting: FoundReportResponse): void {
    this.foundReportsService.unmatch(sighting.id).subscribe({
      next: () => {
        this.loadSightings(this.sightingsForReport()!.id);
        this.refreshAllLists();
      },
      error: () => this.sightingActionError.set('No pudimos descartar la coincidencia.'),
    });
  }

  confirmSightingFound(sighting: FoundReportResponse): void {
    this.foundReportsService.confirmFound(sighting.id).subscribe({
      next: () => {
        this.loadSightings(this.sightingsForReport()!.id);
        this.refreshAllLists();
      },
      error: () => this.sightingActionError.set('No pudimos confirmar el encuentro.'),
    });
  }
  // ---------- Eliminar (con confirmación) ----------

  requestDeleteReport(item: MyReportItem): void {
    this.reportToDelete.set(item);
  }

  confirmDeleteReport(): void {
    const item = this.reportToDelete();
    if (!item) return;

    const delete$ =
      item.kind === 'LOST'
        ? this.lostReportsService.delete(item.id)
        : this.foundReportsService.delete(item.id);

    delete$.subscribe({
      next: () => {
        this.myReports.update((list) => list.filter((r) => r.id !== item.id));
        this.reportToDelete.set(null);
      },
      error: () => {
        this.generalError.set('No pudimos eliminar el reporte.');
        this.reportToDelete.set(null);
      },
    });
  }

  cancelDeleteReport(): void {
    this.reportToDelete.set(null);
  }

  // ---------- Editar ----------

  openEditReport(item: MyReportItem): void {
    this.editingReportItem.set(item);
    this.editGeneralError.set(null);

    if (item.kind === 'LOST') {
      this.lostReportsService.getById(item.id).subscribe({
        next: (response) => {
          this.editForm.patchValue({
            title: response.data.title,
            description: response.data.description,
            contactPhone: response.data.contact_phone,
            address: response.data.address,
            date: response.data.lost_date,
            reward: response.data.reward,
          });
        },
      });
    } else {
      this.foundReportsService.getById(item.id).subscribe({
        next: (response) => {
          this.editForm.patchValue({
            title: response.data.title,
            description: response.data.description,
            contactPhone: response.data.contact_phone,
            address: response.data.address,
            date: response.data.found_date,
            reward: null,
          });
        },
      });
    }
  }

  closeEditReport(): void {
    this.editingReportItem.set(null);
    this.editForm.reset();
  }

  submitEditReport(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const item = this.editingReportItem();
    if (!item) return;

    this.savingEdit.set(true);
    this.editGeneralError.set(null);
    const raw = this.editForm.getRawValue();

    if (item.kind === 'LOST') {
      const payload = {
        title: raw.title,
        description: raw.description,
        contact_phone: raw.contactPhone || null,
        address: raw.address || null,
        lost_date: raw.date,
        reward: raw.reward !== null && raw.reward !== '' ? Number(raw.reward) : null,
      };
      this.lostReportsService.update(item.id, payload).subscribe({
        next: () => this.onEditSaved(),
        error: (error) => this.onEditError(error),
      });
    } else {
      const payload = {
        title: raw.title,
        description: raw.description,
        contact_phone: raw.contactPhone || null,
        address: raw.address || null,
        found_date: raw.date,
      };
      this.foundReportsService.update(item.id, payload).subscribe({
        next: () => this.onEditSaved(),
        error: (error) => this.onEditError(error),
      });
    }
  }

  private onEditSaved(): void {
    this.savingEdit.set(false);
    this.closeEditReport();
    this.refreshAllLists();
  }

  private onEditError(error: any): void {
    this.savingEdit.set(false);
    const parsed = parseApiError(error);
    this.editGeneralError.set(parsed.message);
  }

  editFieldError(field: string): string | null {
    const control = this.editForm.get(field);
    if (control?.touched && control.hasError('required')) return 'Este campo es obligatorio.';
    return null;
  }

  // ---------- Detalle ----------

  openDetail(item: UnifiedReportItem | MyReportItem): void {
    this.selectedItem.set(item);
    this.selectedDetail.set(null);
    this.loadingDetail.set(true);

    if (item.kind === 'LOST') {
      this.lostReportsService.getById(item.id).subscribe({
        next: (response) => {
          this.selectedDetail.set({ kind: 'LOST', data: response.data });
          this.loadingDetail.set(false);
        },
        error: () => this.loadingDetail.set(false),
      });
    } else {
      this.foundReportsService.getById(item.id).subscribe({
        next: (response) => {
          this.selectedDetail.set({ kind: 'FOUND', data: response.data });
          this.loadingDetail.set(false);
        },
        error: () => this.loadingDetail.set(false),
      });
    }
  }

  closeDetail(): void {
    this.selectedItem.set(null);
    this.selectedDetail.set(null);
  }

  speciesName(speciesId: string | null): string {
    if (!speciesId) return '';
    return this.species().find((s) => s.id === speciesId)?.name ?? '';
  }

  getEmoji(speciesName?: string): string {
    if (!speciesName) return '🐾';
    return this.speciesEmoji[speciesName] ?? '🐾';
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

  navigateToReport(item?: UnifiedReportItem): void {
    const queryParams = item?.kind === 'LOST' ? { lostReportId: item.id } : {};
    this.router.navigate(['/dashboard/reportar-avistamiento'], { queryParams });
  }
}
