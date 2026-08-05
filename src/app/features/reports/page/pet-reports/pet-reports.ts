import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportMapComponent } from '../../components/report-map/report-map';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { PetSelectComponent, SelectOption } from '../../../pets/components/select-pets/select-pets';
import { PetInputComponent } from '../../../../shared/components/pet-input/pet-input';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer';
import {
  COLOMBIA_DEPARTMENTS,
  getDepartmentByValue,
  getCitiesByDepartment,
} from '../../../../core/services/colombia-locations';
import { ReportsFacade } from '../../../reports/data-access/reports';
import { CatalogService } from '../../../../core/services/catalog';
import { LostReportsService } from '../../../reports/data-access/lost-reports';
import { FoundReportsService } from '../../../reports/data-access/found-reports';
import { PetsService } from '../../../pets/data-access/pets';
import { AuthService } from '../../../../core/services/auth';
import { parseApiError } from '../../../../core/services/api-error';
import {
  FOUND_STATUS_LABELS,
  LOST_STATUS_LABELS,
  MyReportItem,
  UnifiedReportItem,
} from '../../../reports/data-access/report-models';
import { SpeciesResponse } from '../../../pets/data-access/pet.models';
import { LostReportResponse } from '../../../reports/data-access/lost-report-models';
import { FoundReportResponse } from '../../../reports/data-access/report-models';

type ReportDetail =
  | { kind: 'LOST'; data: LostReportResponse }
  | { kind: 'FOUND'; data: FoundReportResponse };

/** Cada pestaña pagina contra su propio endpoint del backend — ver
 * ReportsFacade. 'MINE' sigue siendo un listado propio, sin paginación
 * (bajo volumen esperado: reportes del usuario autenticado). */
type Tab = 'LOST' | 'FOUND' | 'MINE';

const PAGE_SIZE = 50;

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
    ImageViewerComponent,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ReportMapComponent,
  ],
  templateUrl: './pet-reports.html',
})
export class PetReportsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private reportsFacade = inject(ReportsFacade);
  private catalogService = inject(CatalogService);
  private lostReportsService = inject(LostReportsService);
  private foundReportsService = inject(FoundReportsService);
  private petsService = inject(PetsService);
  private authService = inject(AuthService);

  activeTab = signal<Tab>('LOST');

  reports = signal<UnifiedReportItem[]>([]);
  myReports = signal<MyReportItem[]>([]);
  species = signal<SpeciesResponse[]>([]);
  isLoading = signal(false);
  generalError = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // ---------- Paginación (solo aplica a LOST/FOUND, no a MINE) ----------
  page = signal(1);
  total = signal(0);
  totalPages = signal(0);
  readonly pageSize = PAGE_SIZE;

  selectedItem = signal<UnifiedReportItem | null>(null);
  selectedDetail = signal<ReportDetail | null>(null);
  loadingDetail = signal(false);
  detailViewerOpen = signal(false);

  currentUserId = computed(() => this.authService.currentUser()?.id ?? null);

  // ---------- Filtros ----------
  filterSpecies = signal('');
  filterDepartment = signal('');
  filterCity = signal('');
  cityOptions = signal<SelectOption[]>([]);

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

  // ---------- Visor de foto completa del avistamiento ----------
  sightingViewerUrl = signal<string | null>(null);
  sightingViewerOpen = signal(false);

  openSightingPhoto(url: string): void {
    this.sightingViewerUrl.set(url);
    this.sightingViewerOpen.set(true);
  }

  closeSightingPhoto(): void {
    this.sightingViewerOpen.set(false);
  }

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
    reward: [null, [Validators.min(0), Validators.max(99999999.99)]],
  });

  // ---------- Bindings de filtros (two-way, reinician página y recargan) ----------

  get filterSpeciesValue() {
    return this.filterSpecies();
  }
  set filterSpeciesValue(v: string) {
    this.filterSpecies.set(v);
    this.applyFilterChange();
  }

  get filterDepartmentValue() {
    return this.filterDepartment();
  }
  set filterDepartmentValue(v: string) {
    this.filterDepartment.set(v);
    this.cityOptions.set(v ? getCitiesByDepartment(v) : []);
    this.filterCity.set('');
    this.applyFilterChange();
  }

  get filterCityValue() {
    return this.filterCity();
  }
  set filterCityValue(v: string) {
    this.filterCity.set(v);
    this.applyFilterChange();
  }

  readonly departmentOptions: SelectOption[] = COLOMBIA_DEPARTMENTS.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  get speciesOptions(): SelectOption[] {
    return [
      { value: '', label: 'Todas las especies' },
      ...this.species().map((s) => ({ value: s.id, label: s.name })),
    ];
  }

  readonly speciesIcon: Record<string, string> = { Perro: 'dog', Gato: 'cat', Ave: 'bird' };
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

  ngOnInit(): void {
    this.catalogService.listSpecies().subscribe({
      next: (response) => this.species.set(response.data),
      error: () => {},
    });

    this.route.queryParams.subscribe((params) => {
      if (params['tab'] === 'MINE' && params['report']) {
        this.activeTab.set('MINE');
        this.loadMyReports(params['report']);
      } else {
        this.reload();
      }
    });
  }

  switchTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.page.set(1);
    if (tab === 'MINE') {
      this.loadMyReports();
    } else {
      this.reload();
    }
  }

  private applyFilterChange(): void {
    this.page.set(1);
    if (this.activeTab() !== 'MINE') this.reload();
  }

  private refreshAllLists(): void {
    if (this.activeTab() === 'MINE') {
      this.loadMyReports();
    } else {
      this.reload();
    }
  }

  isResolved(item: UnifiedReportItem | MyReportItem): boolean {
    if (item.kind === 'FOUND') return true;
    return item.status === 'FOUND' || item.status === 'Encontrada';
  }

  /** Colores del badge de estado según la etiqueta legible ya traducida que
   * guarda MyReportItem.status. */
  statusBadgeColors(item: MyReportItem): { bg: string; fg: string } {
    const s = item.status;
    if (s === 'Encontrada' || s === 'Aprobado') return { bg: '#d1fae5', fg: '#065f46' };
    if (s === 'Solicitud de encontrada') return { bg: '#ede9fe', fg: '#5b21b6' };
    if (s === 'Activo - Buscando') return { bg: '#fef3c7', fg: '#92400e' };
    if (s === 'Posible coincidencia') return { bg: '#dbeafe', fg: '#1e40af' };
    if (s === 'Rechazado') return { bg: '#fee2e2', fg: '#991b1b' };
    return { bg: '#f3f4f6', fg: '#374151' };
  }

  isOwnReport(item: UnifiedReportItem): boolean {
    return item.createdBy === this.currentUserId();
  }

  /** Etiqueta legible de la ciudad seleccionada en el filtro (para el chip
   * "Mostrando en X"). El value del select es un slug con sufijo de
   * departamento, así que se resuelve dentro del departamento activo. */
  getCityLabel(cityValue: string): string {
    return (
      getCitiesByDepartment(this.filterDepartment()).find((c) => c.value === cityValue)?.label ??
      cityValue
    );
  }

  private currentCityLabelForQuery(): string | undefined {
    const value = this.filterCity();
    if (!value) return undefined;
    return this.getCityLabel(value);
  }

  private reload(): void {
    this.isLoading.set(true);
    this.generalError.set(null);

    const query = {
      page: this.page(),
      pageSize: this.pageSize,
      speciesId: this.filterSpecies() || undefined,
      city: this.currentCityLabelForQuery(),
      sort: 'published_at',
      order: 'desc' as const,
    };

    const list$ =
      this.activeTab() === 'FOUND'
        ? forkJoin([
            this.reportsFacade.listFound({
              ...query,
              page: 1,
              pageSize: 100,
              status: 'APPROVED',
            }),
            this.reportsFacade.listLost({ ...query, page: 1, pageSize: 100, status: 'FOUND' }),
          ]).pipe(
            map(([found, resolved]) => {
              const all = [...resolved.items, ...found.items].sort((a, b) =>
                b.publishedAt.localeCompare(a.publishedAt),
              );
              const total = all.length;
              const start = (this.page() - 1) * this.pageSize;
              return {
                items: all.slice(start, start + this.pageSize),
                total,
                pages: Math.max(1, Math.ceil(total / this.pageSize)),
              };
            }),
          )
        : this.reportsFacade.listLost({ ...query, status: 'PUBLISHED' });

    list$.subscribe({
      next: (result) => {
        this.reports.set(result.items);
        this.total.set(result.total);
        this.totalPages.set(result.pages);
        this.isLoading.set(false);
        this.attachPhotos(result.items, this.reports);
      },
      error: () => {
        this.generalError.set('No pudimos cargar los reportes.');
        this.isLoading.set(false);
      },
    });
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.page.set(newPage);
    this.reload();
  }

  private attachPhotos(
    items: UnifiedReportItem[],
    target: typeof this.reports | typeof this.myReports,
  ): void {
    if (items.length === 0) return;

    const requests = items.map((item) => {
      if (item.kind === 'LOST') {
        return this.lostReportsService.listImages(item.id).pipe(
          switchMap((res) => {
            const images = res.data;
            const reportPrimary = images.find((img) => img.is_primary) ?? images[0];
            if (reportPrimary?.url) return of(reportPrimary.url);
            if (!item.petId) return of(undefined);
            return this.petsService.listImages(item.petId).pipe(
              map((pres) => {
                const pImages = pres.data;
                const p = pImages.find((img) => img.is_primary) ?? pImages[0];
                return p?.url;
              }),
              catchError(() => of(undefined)),
            );
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

  private loadMyReports(openReportId?: string): void {
    this.isLoading.set(true);

    forkJoin([
      this.lostReportsService.mine().pipe(catchError(() => of({ data: { items: [] } } as any))),
      this.foundReportsService.mine().pipe(catchError(() => of({ data: { items: [] } } as any))),
    ]).subscribe(([lostRes, foundRes]) => {
      const lostItems: MyReportItem[] = lostRes.data.items.map((item: any) => {
        const requested = !!item.found_requested_at;
        const raw = item.status as string;
        return {
          id: item.id,
          kind: 'LOST',
          title: item.title,
          rawStatus: raw,
          status:
            raw === 'PUBLISHED' && requested
              ? 'Solicitud de encontrada'
              : LOST_STATUS_LABELS[raw as keyof typeof LOST_STATUS_LABELS] ?? raw,
          city: item.city,
          speciesId: null,
          petId: item.pet_id ?? null,
          date: item.lost_date,
          publishedAt: item.published_at,
          createdBy: item.created_by,
          canMarkAsFound: raw === 'PUBLISHED' && !requested,
          foundRequested: requested,
        };
      });

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

      if (openReportId) {
        const item = combined.find((i) => i.id === openReportId);
        if (item) this.openSightingsModal(item);
      }
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
        this.successMessage.set('Solicitud enviada. El equipo aprobará el cambio a encontrada.');
        this.refreshAllLists();
      },
      error: (error) => {
        this.reportToMarkAsFound.set(null);
        this.generalError.set(
          (error as { error?: { message?: string } })?.error?.message ??
            'No pudimos enviar la solicitud.',
        );
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

  getSpeciesIcon(speciesName?: string): string {
    if (!speciesName) return 'paw-print';
    return this.speciesIcon[speciesName] ?? 'paw-print';
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
