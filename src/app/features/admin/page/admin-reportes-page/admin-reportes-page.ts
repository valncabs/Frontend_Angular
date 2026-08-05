import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable, from, forkJoin, of } from 'rxjs';
import { mergeMap, toArray, catchError } from 'rxjs/operators';

import { AdminReportsService } from '../../data-access/admin-reports';
import { LostReportsService } from '../../../reports/data-access/lost-reports';
import { FoundReportsService } from '../../../reports/data-access/found-reports';
import { CatalogService } from '../../../../core/services/catalog';
import { AdminReportDetail, AdminReportListItem } from '../../data-access/admin-reports.models';
import { SpeciesResponse } from '../../../pets/data-access/pet.models';
import {
  LOST_REPORT_STATUS_LABELS,
  LostReportStatus,
} from '../../../reports/data-access/lost-report-models';
import {
  FOUND_STATUS_LABELS,
  FoundReportResponse,
  FoundReportStatus,
} from '../../../reports/data-access/report-models';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

type TypeFilter = 'ALL' | 'LOST' | 'FOUND';

interface GalleryImage {
  url: string;
  isPrimary: boolean;
}

@Component({
  selector: 'app-admin-reportes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PetButtonComponent, ConfirmDialogComponent],
  templateUrl: './admin-reportes-page.html',
})
export class AdminReportesPage implements OnInit {
  private readonly adminReports = inject(AdminReportsService);
  private readonly lostReportsService = inject(LostReportsService);
  private readonly foundReportsService = inject(FoundReportsService);
  private readonly catalogService = inject(CatalogService);

  reports = signal<AdminReportListItem[]>([]);
  species = signal<SpeciesResponse[]>([]);
  isLoading = signal(false);
  generalError = signal<string | null>(null);
  actionInProgress = signal<string | null>(null);
  exportLoading = signal(false);

  // ---------- Filtros ----------
  searchTerm = signal('');
  filterType = signal<TypeFilter>('ALL');
  filterSpecies = signal<string>('');
  filterCity = signal<string>('');
  filterStatus = signal<string>('');
  filterDateFrom = signal<string>('');
  filterDateTo = signal<string>('');

  page = signal(1);
  pageSize = signal(20);
  total = signal(0);
  totalPages = signal(0);

  readonly typeOptions: TypeFilter[] = ['ALL', 'LOST', 'FOUND'];

  /** El selector de estado se adapta según el tipo elegido, porque LOST y
   * FOUND tienen enums de status distintos. Con "ALL" muestro la unión. */
  statusOptions = computed<{ value: string; label: string }[]>(() => {
    const type = this.filterType();
    const lost = Object.entries(LOST_REPORT_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    }));
    const found = Object.entries(FOUND_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    }));

    if (type === 'LOST') return [{ value: '', label: 'Todos los estados' }, ...lost];
    if (type === 'FOUND') return [{ value: '', label: 'Todos los estados' }, ...found];

    const merged = new Map<string, string>();
    [...lost, ...found].forEach((s) => merged.set(s.value, s.label));
    return [
      { value: '', label: 'Todos los estados' },
      ...Array.from(merged, ([value, label]) => ({ value, label })),
    ];
  });

  // ---------- Fila expandida ----------
  expandedId = signal<string | null>(null);
  expandedDetail = signal<AdminReportDetail | null>(null);
  expandedLoading = signal(false);
  expandedError = signal<string | null>(null);
  petGallery = signal<GalleryImage[]>([]);
  reportGallery = signal<GalleryImage[]>([]);

  /** Avistamiento pendiente de expandir tras una recarga de la tabla. */
  private pendingSightingId = signal<string | null>(null);

  // ---------- Lightbox de imágenes ----------
  lightboxImage = signal<string | null>(null);

  openLightbox(url: string): void {
    this.lightboxImage.set(url);
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }
  // ---------- Confirmación cerrar/eliminar ----------
  confirmDialogOpen = signal(false);
  confirmDialogMode = signal<'CLOSE' | 'DELETE'>('CLOSE');
  confirmDialogTarget = signal<AdminReportListItem | null>(null);

  ngOnInit(): void {
    this.catalogService.listSpecies().subscribe({
      next: (res) => this.species.set(res.data),
      error: () => {},
    });
    this.reload();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeLightbox();
  }

  speciesName(id: string | null | undefined): string {
    if (!id) return '—';
    return this.species().find((s) => s.id === id)?.name ?? '—';
  }

  statusLabel(status: string): string {
    return (
      LOST_REPORT_STATUS_LABELS[status as LostReportStatus] ??
      FOUND_STATUS_LABELS[status as FoundReportStatus] ??
      status
    );
  }

  /** Etiqueta de estado para una fila LOST, incluyendo la solicitud de
   * encontrada del dueño (aún pendiente de aprobación del admin). */
  rowStatusLabel(r: AdminReportListItem): string {
    if (r.type === 'LOST' && r.status === 'PUBLISHED' && r.found_requested_at) {
      return 'Activo · Solicitud de encontrada';
    }
    return this.statusLabel(r.status);
  }

  /** Badge de "tipo" que refleja el estado actual: un perdido que ya fue
   * encontrado se muestra como "Encontrada" y no sigue como "Perdida". */
  typeBadge(r: AdminReportListItem): { text: string; bg: string; fg: string } {
    if (r.type === 'FOUND') return { text: 'Avistamiento', bg: '#dbeafe', fg: '#1e40af' };
    if (r.status === 'FOUND') return { text: 'Encontrada', bg: '#d1fae5', fg: '#065f46' };
    if (r.status === 'CLOSED') return { text: 'Perdida', bg: '#f1f5f9', fg: '#64748b' };
    return { text: 'Perdida', bg: '#fee2e2', fg: '#991b1b' };
  }

  reload(): void {
    this.isLoading.set(true);
    this.generalError.set(null);

    const type = this.filterType();
    this.adminReports
      .list({
        page: this.page(),
        pageSize: this.pageSize(),
        search: this.searchTerm() || undefined,
        reportType: type === 'ALL' ? undefined : type,
        speciesId: this.filterSpecies() || undefined,
        status: this.filterStatus() || undefined,
        city: this.filterCity() || undefined,
        dateFrom: this.filterDateFrom() || undefined,
        dateTo: this.filterDateTo() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.reports.set(res.data.items);
          this.total.set(res.data.total);
          this.totalPages.set(res.data.pages);
          this.isLoading.set(false);
          this.expandPendingSighting();
        },
        error: () => {
          this.generalError.set('No pudimos cargar los reportes.');
          this.isLoading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.page.set(1);
    this.reload();
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.page.set(newPage);
    this.reload();
  }

  // ---------- Expandir fila / cargar imágenes ----------

  toggleExpand(item: AdminReportListItem): void {
    if (this.expandedId() === item.id) {
      this.expandedId.set(null);
      this.expandedDetail.set(null);
      return;
    }

    this.expandedId.set(item.id);
    this.expandedDetail.set(null);
    this.expandedError.set(null);
    this.petGallery.set([]);
    this.reportGallery.set([]);
    this.expandedLoading.set(true);

    this.adminReports.getDetail(item.id, item.type).subscribe({
      next: (detail) => {
        this.expandedDetail.set(detail);
        this.reportGallery.set(
          detail.reportImages.map((img) => ({ url: img.url, isPrimary: img.is_primary })),
        );
        this.expandedLoading.set(false);

        if (detail.kind === 'LOST' && detail.petId) {
          this.adminReports.getPetImages(detail.petId).subscribe({
            next: (images) =>
              this.petGallery.set(
                images.map((img) => ({ url: img.url, isPrimary: img.is_primary })),
              ),
            error: () => {}, // sin fotos de mascota no es un error bloqueante
          });
        }
      },
      error: () => {
        this.expandedError.set('No pudimos cargar el detalle de este reporte.');
        this.expandedLoading.set(false);
      },
    });
  }

  /** Redirige a un avistamiento del flujo: si su fila está visible la expande
   * y hace scroll hasta ella; si está fuera de la vista (filtro/página), ajusta
   * el filtro a avistamientos, recarga y la expande al llegar. */
  goToSighting(sightingId: string): void {
    const found = this.reports().find((r) => r.type === 'FOUND' && r.id === sightingId);
    if (found) {
      if (this.expandedId() === found.id) {
        this.scrollToReportRow(found.id);
        return;
      }
      this.toggleExpand(found);
      this.scrollToReportRow(found.id);
      return;
    }

    this.filterType.set('FOUND');
    this.filterStatus.set('');
    this.searchTerm.set('');
    this.page.set(1);
    this.pendingSightingId.set(sightingId);
    this.reload();
  }

  private expandPendingSighting(): void {
    const id = this.pendingSightingId();
    if (!id) return;
    this.pendingSightingId.set(null);

    const found = this.reports().find((r) => r.type === 'FOUND' && r.id === id);
    if (found) {
      this.toggleExpand(found);
      this.scrollToReportRow(found.id);
    }
  }

  private scrollToReportRow(id: string): void {
    setTimeout(() => {
      document
        .getElementById(`admin-report-row-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ---------- Acciones admin: cerrar / eliminar ----------

  openConfirm(item: AdminReportListItem, mode: 'CLOSE' | 'DELETE'): void {
    this.confirmDialogTarget.set(item);
    this.confirmDialogMode.set(mode);
    this.confirmDialogOpen.set(true);
  }

  cancelConfirm(): void {
    this.confirmDialogOpen.set(false);
    this.confirmDialogTarget.set(null);
  }

  runConfirm(): void {
    const item = this.confirmDialogTarget();
    if (!item) return;

    const service = item.type === 'LOST' ? this.lostReportsService : this.foundReportsService;
    const action$: Observable<unknown> =
      this.confirmDialogMode() === 'CLOSE'
        ? service.adminClose(item.id)
        : service.adminDelete(item.id);

    this.actionInProgress.set(item.id);
    action$.subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.confirmDialogOpen.set(false);
        if (this.expandedId() === item.id) this.expandedId.set(null);
        this.reload();
      },
      error: (error: unknown) => {
        this.actionInProgress.set(null);
        this.confirmDialogOpen.set(false);
        this.generalError.set(
          (error as { error?: { message?: string } })?.error?.message ??
            'No pudimos completar la acción.',
        );
      },
    });
  }

  // ---------- Aprobar / rechazar avistamientos (flujo existente) ----------

  approve(reportId: string): void {
    this.actionInProgress.set(reportId);
    this.foundReportsService.approve(reportId).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.reload();
        this.refreshExpanded();
      },
      error: (error) => {
        this.actionInProgress.set(null);
        this.generalError.set(error?.error?.message ?? 'No pudimos aprobar el avistamiento.');
      },
    });
  }

  reject(reportId: string): void {
    this.actionInProgress.set(reportId);
    this.foundReportsService.reject(reportId).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.reload();
        this.refreshExpanded();
      },
      error: (error) => {
        this.actionInProgress.set(null);
        this.generalError.set(error?.error?.message ?? 'No pudimos rechazar el avistamiento.');
      },
    });
  }

  /** El admin cambia 100% el estado del reporte de pérdida a encontrada. */
  markFound(reportId: string): void {
    this.actionInProgress.set(reportId);
    this.lostReportsService.adminMarkFound(reportId).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.generalError.set(null);
        this.reload();
        this.refreshExpanded();
      },
      error: (error) => {
        this.actionInProgress.set(null);
        this.generalError.set(error?.error?.message ?? 'No pudimos marcar el reporte como encontrado.');
      },
    });
  }

  /** Recarga el detalle + avistamientos de la fila expandida, para reflejar
   * los cambios de estado tras una acción admin. */
  private refreshExpanded(): void {
    const item = this.reports().find((r) => r.id === this.expandedId());
    if (item) {
      this.toggleExpand(item);
      this.toggleExpand(item);
    }
  }

  sightingBadge(status: string): { bg: string; fg: string } {
    const colors: Record<string, { bg: string; fg: string }> = {
      PUBLISHED: { bg: '#fef3c7', fg: '#92400e' },
      MATCHED: { bg: '#dbeafe', fg: '#1e40af' },
      APPROVED: { bg: '#d1fae5', fg: '#065f46' },
      REJECTED: { bg: '#fee2e2', fg: '#991b1b' },
      CLOSED: { bg: '#f3f4f6', fg: '#6b7280' },
    };
    return colors[status] ?? { bg: '#f3f4f6', fg: '#6b7280' };
  }

  // ---------- Cerrar un avistamiento desde el flujo del reporte ----------

  sightingToClose = signal<FoundReportResponse | null>(null);

  openConfirmSighting(sighting: FoundReportResponse): void {
    this.sightingToClose.set(sighting);
  }

  cancelSightingClose(): void {
    this.sightingToClose.set(null);
  }

  confirmSightingClose(): void {
    const sighting = this.sightingToClose();
    if (!sighting) return;

    this.actionInProgress.set(sighting.id);
    this.foundReportsService.adminClose(sighting.id).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.sightingToClose.set(null);
        this.reload();
        this.refreshExpanded();
      },
      error: (error) => {
        this.actionInProgress.set(null);
        this.sightingToClose.set(null);
        this.generalError.set(error?.error?.message ?? 'No pudimos cerrar el avistamiento.');
      },
    });
  }

  // ---------- Exportar a PDF ----------

  exportToPdf(): void {
    this.exportLoading.set(true);
    this.generalError.set(null);

    this.adminReports
      .list({
        page: 1,
        pageSize: 500,
        search: this.searchTerm() || undefined,
        reportType: (() => {
          const t = this.filterType();
          return t === 'ALL' ? undefined : t;
        })(),
        speciesId: this.filterSpecies() || undefined,
        status: this.filterStatus() || undefined,
        city: this.filterCity() || undefined,
        dateFrom: this.filterDateFrom() || undefined,
        dateTo: this.filterDateTo() || undefined,
      })
      .subscribe({
        next: (res) => this.buildDetailedPdf(res.data.items),
        error: () => {
          this.generalError.set('No pudimos generar el PDF.');
          this.exportLoading.set(false);
        },
      });
  }

  /** Trae el detalle + imágenes de cada reporte (con concurrencia limitada
   * a 5 en paralelo, para no saturar el backend con listas grandes), y con
   * eso arma un PDF con una sección por reporte, igual que la fila expandida. */
  private buildDetailedPdf(items: AdminReportListItem[]): void {
    if (items.length === 0) {
      this.buildPdf(items);
      this.exportLoading.set(false);
      return;
    }

    from(items)
      .pipe(
        mergeMap(
          (item) =>
            this.adminReports.getDetail(item.id, item.type).pipe(
              mergeMap((detail) => {
                if (detail.kind === 'LOST' && detail.petId) {
                  return this.adminReports.getPetImages(detail.petId).pipe(
                    mergeMap((petImages) =>
                      of({
                        item,
                        detail,
                        petImages: petImages.map((img) => ({
                          url: img.url,
                          isPrimary: img.is_primary,
                        })) as GalleryImage[],
                      }),
                    ),
                    catchError(() => of({ item, detail, petImages: [] as GalleryImage[] })),
                  );
                }
                return of({ item, detail, petImages: [] as GalleryImage[] });
              }),
              catchError(() =>
                of({
                  item,
                  detail: null as AdminReportDetail | null,
                  petImages: [] as GalleryImage[],
                }),
              ),
            ),
          5,
        ),
        toArray(),
      )
      .subscribe({
        next: (results) => {
          this.renderDetailedPdf(results);
          this.exportLoading.set(false);
        },
        error: () => {
          this.generalError.set('No pudimos generar el PDF con los detalles.');
          this.exportLoading.set(false);
        },
      });
  }

  private async renderDetailedPdf(
    results: {
      item: AdminReportListItem;
      detail: AdminReportDetail | null;
      petImages: GalleryImage[];
    }[],
  ): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait' });
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 14;
    const marginRight = 14;
    const marginBottom = 18;
    const contentWidth = pageWidth - marginLeft - marginRight;

    const colors = {
      primary: [30, 64, 175] as [number, number, number],
      textDark: [30, 41, 59] as [number, number, number],
      textMuted: [100, 116, 139] as [number, number, number],
      cardBg: [248, 250, 252] as [number, number, number],
      cardBorder: [226, 232, 240] as [number, number, number],
      lostBg: [254, 226, 226] as [number, number, number],
      lostText: [185, 28, 28] as [number, number, number],
      foundBg: [219, 234, 254] as [number, number, number],
      foundText: [30, 64, 175] as [number, number, number],
      statusBg: [243, 244, 246] as [number, number, number],
      statusText: [107, 114, 128] as [number, number, number],
    };

    let y = 0;

    // ===== 1. Encabezado =====
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('Pet-Centric', marginLeft, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.text('Reporte de mascotas perdidas y encontradas', marginLeft, 23);
    doc.setFontSize(8);
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, marginLeft, 29);
    y = 42;

    doc.setDrawColor(...colors.cardBorder);
    doc.setFillColor(...colors.cardBg);
    const filtersLines = doc.splitTextToSize(
      `Filtros aplicados: ${this.describeFilters()}`,
      contentWidth - 8,
    );
    const filtersBoxHeight = filtersLines.length * 4.5 + 6;
    doc.roundedRect(marginLeft, y, contentWidth, filtersBoxHeight, 2, 2, 'FD');
    doc.setTextColor(...colors.textMuted);
    doc.setFontSize(8.5);
    doc.text(filtersLines, marginLeft + 4, y + 6);
    y += filtersBoxHeight + 10;

    // ===== 2. Resumen =====
    const total = results.length;
    const lostCount = results.filter((r) => r.item.type === 'LOST').length;
    const foundCount = total - lostCount;

    doc.setTextColor(...colors.textDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Resumen', marginLeft, y);
    y += 3;
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.6);
    doc.line(marginLeft, y, marginLeft + 22, y);
    doc.setLineWidth(0.2);
    y += 8;

    const statCards = [
      { label: 'Total de reportes', value: String(total), accent: colors.primary },
      { label: 'Perdidas', value: String(lostCount), accent: colors.lostText },
      { label: 'Avistamientos', value: String(foundCount), accent: colors.foundText },
    ];
    const statCardWidth = (contentWidth - 8 * (statCards.length - 1)) / statCards.length;
    let statX = marginLeft;
    for (const stat of statCards) {
      doc.setDrawColor(...colors.cardBorder);
      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(statX, y, statCardWidth, 22, 2, 2, 'FD');
      doc.setTextColor(...stat.accent);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(stat.value, statX + 5, y + 12);
      doc.setTextColor(...colors.textMuted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(stat.label, statX + 5, y + 18);
      statX += statCardWidth + 8;
    }
    y += 22 + 12;

    doc.setTextColor(...colors.textDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Detalle de reportes', marginLeft, y);
    y += 3;
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.6);
    doc.line(marginLeft, y, marginLeft + 32, y);
    doc.setLineWidth(0.2);
    y += 10;

    // ===== 3. Tarjetas de reportes =====
    const innerX = marginLeft + 2;
    const innerWidth = contentWidth - 4;
    const colWidth = (contentWidth - 8) / 2;
    const leftX = innerX;
    const rightX = marginLeft + colWidth + 10;

    /** Dibuja (draw=true) o solo mide (draw=false) el contenido completo de
     * una tarjeta a partir de startY, y devuelve la altura total ocupada.
     * Usar la MISMA función para medir y para dibujar garantiza que la
     * reserva de espacio sea exacta y la tarjeta nunca quede partida entre
     * dos páginas. */
    const layoutCard = (
      startY: number,
      item: AdminReportListItem,
      detail: AdminReportDetail | null,
      hasReportPhoto: boolean,
      hasPetPhoto: boolean,
      draw: boolean,
    ): number => {
      let cy = startY + 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const titleLines = doc.splitTextToSize(item.title || '(Sin título)', innerWidth);
      if (draw) {
        doc.setTextColor(...colors.textDark);
        doc.text(titleLines, innerX, cy);
      }
      cy += (titleLines.length - 1) * 5 + 8; // más aire antes de los badges

      let bx = innerX;
      const typeBadge =
        item.type === 'LOST'
          ? item.status === 'FOUND'
            ? { text: 'Encontrada', bg: colors.foundBg, fg: colors.foundText }
            : { text: 'Perdida', bg: colors.lostBg, fg: colors.lostText }
          : { text: 'Avistamiento', bg: colors.foundBg, fg: colors.foundText };

      doc.setFontSize(7.5);
      const paintBadge = (
        text: string,
        x: number,
        bg: [number, number, number],
        fg: [number, number, number],
      ) => {
        const w = doc.getTextWidth(text) + 6;
        if (draw) {
          doc.setFillColor(...bg);
          doc.roundedRect(x, cy - 4, w, 5.5, 1.2, 1.2, 'F');
          doc.setTextColor(...fg);
          doc.text(text, x + 3, cy);
        }
        return w;
      };
      bx += paintBadge(typeBadge.text, bx, typeBadge.bg, typeBadge.fg) + 4;
      bx += paintBadge(this.statusLabel(item.status), bx, colors.statusBg, colors.statusText) + 4;
      if (draw) {
        doc.setFontSize(8);
        doc.setTextColor(...colors.textMuted);
        doc.text(`${item.city}  ·  ${new Date(item.date).toLocaleDateString('es-CO')}`, bx, cy);
      }
      cy += 9;

      if (!detail) {
        if (draw) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(...colors.textMuted);
          doc.text('No se pudo cargar el detalle de este reporte.', innerX, cy);
        }
        cy += 8;
        return cy - startY;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const descLines = doc.splitTextToSize(detail.description || 'Sin descripción', innerWidth);
      if (draw) {
        doc.setTextColor(...colors.textDark);
        doc.text(descLines, innerX, cy);
      }
      cy += descLines.length * 4.5 + 5;

      const field = (
        label: string,
        value: string | number | null | undefined,
        x: number,
        width: number,
        curY: number,
      ): number => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        const labelWidth = doc.getTextWidth(`${label}: `);
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(
          String(value ?? '—'),
          Math.max(10, width - labelWidth),
        );
        const h = Math.max(5, valueLines.length * 4.5);
        if (draw) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(...colors.textMuted);
          doc.text(`${label}:`, x, curY);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.textDark);
          doc.text(valueLines, x + labelWidth, curY);
        }
        return h;
      };

      let cyLeft = cy;
      cyLeft += field('Dirección', detail.address, leftX, colWidth, cyLeft);
      cyLeft += field('Ubicación', `${detail.city}, ${detail.department}`, leftX, colWidth, cyLeft);
      cyLeft += field('Contacto', detail.contactPhone, leftX, colWidth, cyLeft);

      let cyRight = cy;
      cyRight += field(
        'Publicado',
        new Date(detail.publishedAt).toLocaleDateString('es-CO'),
        rightX,
        colWidth,
        cyRight,
      );
      if (detail.closedAt) {
        cyRight += field(
          'Cerrado',
          new Date(detail.closedAt).toLocaleDateString('es-CO'),
          rightX,
          colWidth,
          cyRight,
        );
      }
      if (detail.kind === 'LOST') {
        cyRight += field(
          'Recompensa',
          detail.reward ? `$${detail.reward}` : 'No ofrece',
          rightX,
          colWidth,
          cyRight,
        );
      } else if (detail.approvedAt) {
        cyRight += field(
          'Aprobado',
          new Date(detail.approvedAt).toLocaleDateString('es-CO'),
          rightX,
          colWidth,
          cyRight,
        );
      }

      cy = Math.max(cyLeft, cyRight) + 2;

      if (detail.kind === 'LOST') {
        if (draw) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...colors.primary);
          doc.text('Mascota', innerX, cy);
        }
        cy += 5.5;
        cy += field('Nombre', detail.petName, leftX, colWidth, cy);
        cy += field('Especie', this.speciesName(detail.petSpeciesId), leftX, colWidth, cy);
        cy += field(
          'Color / Tamaño',
          `${detail.petColor} · ${detail.petSize}`,
          leftX,
          colWidth,
          cy,
        );
        if (detail.petDistinctiveMarks) {
          cy += field('Marcas distintivas', detail.petDistinctiveMarks, leftX, innerWidth, cy);
        }
      } else if (detail.lostReportId) {
        cy += field('Vinculado a reporte de pérdida', detail.lostReportId, leftX, innerWidth, cy);
      }

      if (hasReportPhoto || hasPetPhoto) {
        cy += 2 + 58;
      } else {
        cy += 4;
      }

      return cy - startY;
    };

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - marginBottom) {
        doc.addPage();
        y = 18;
      }
    };

    for (const { item, detail, petImages } of results) {
      const reportPrimary =
        detail?.reportImages.find((im) => im.is_primary) ?? detail?.reportImages[0];
      const petPrimary = petImages.find((im) => im.isPrimary) ?? petImages[0];
      const hasReportPhoto = !!reportPrimary;
      const hasPetPhoto = !!petPrimary;

      // Paso 1: medir sin dibujar, para saber cuánto espacio necesita la tarjeta completa.
      const measuredHeight = layoutCard(0, item, detail, hasReportPhoto, hasPetPhoto, false);

      // Reservamos ese espacio de una sola vez: si no cabe, salta de página
      // ANTES de empezar a dibujar (nunca a la mitad).
      ensureSpace(measuredHeight + 8);

      const cardStartY = y;
      layoutCard(cardStartY, item, detail, hasReportPhoto, hasPetPhoto, true);

      if (detail && (hasReportPhoto || hasPetPhoto)) {
        const photos: { label: string; url: string }[] = [];
        if (reportPrimary) photos.push({ label: 'Foto del reporte', url: reportPrimary.url });
        if (petPrimary) photos.push({ label: 'Foto de la mascota', url: petPrimary.url });

        const photoY = cardStartY + measuredHeight - 58 + 2;
        let px = innerX;
        for (const photo of photos) {
          try {
            const base64 = await this.loadImageAsDataUrl(photo.url);
            if (base64) {
              doc.setFontSize(7.5);
              doc.setTextColor(...colors.textMuted);
              doc.text(photo.label, px, photoY);
              doc.setDrawColor(...colors.cardBorder);
              doc.roundedRect(px, photoY + 2, 50, 50, 1.5, 1.5);
              doc.addImage(base64, 'JPEG', px + 1, photoY + 3, 48, 48);
              px += 58;
            }
          } catch {
            // imagen omitida silenciosamente si falla (CORS, red, etc.)
          }
        }
      }

      doc.setDrawColor(...colors.cardBorder);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginLeft, cardStartY - 4, contentWidth, measuredHeight + 4, 2, 2, 'S');

      y = cardStartY + measuredHeight + 10;
    }

    doc.save(`reportes-pet-centric-detallado-${Date.now()}.pdf`);
  }

  /** Convierte una URL de imagen (Cloudinary, etc.) a base64 para poder
   * incrustarla con jsPDF's addImage. */
  private loadImageAsDataUrl(url: string): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          resolve(null); // típicamente un fallo de CORS al leer el canvas
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  /** PDF de respaldo sin detalle (solo tabla), usado si la lista viene vacía. */
  private buildPdf(items: AdminReportListItem[]): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text('Pet-Centric — Reporte de mascotas perdidas y encontradas', 14, 15);
    doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 14, 21);
    autoTable(doc, {
      startY: 28,
      head: [['Tipo', 'Título', 'Estado', 'Ciudad', 'Fecha']],
      body: [],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 64, 175] },
    });
    doc.save(`reportes-pet-centric-${Date.now()}.pdf`);
  }

  private describeFilters(): string {
    const parts: string[] = [];
    parts.push(`Tipo: ${this.filterType()}`);
    if (this.filterSpecies()) parts.push(`Especie: ${this.speciesName(this.filterSpecies())}`);
    if (this.filterStatus()) parts.push(`Estado: ${this.statusLabel(this.filterStatus())}`);
    if (this.filterCity()) parts.push(`Ciudad: ${this.filterCity()}`);
    if (this.filterDateFrom()) parts.push(`Desde: ${this.filterDateFrom()}`);
    if (this.filterDateTo()) parts.push(`Hasta: ${this.filterDateTo()}`);
    return parts.length ? parts.join(' | ') : 'Sin filtros';
  }
}
