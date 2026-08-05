import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LostReportsService } from './lost-reports';
import { FoundReportsService } from './found-reports';
import { LostReportListItem } from '../../reports/data-access/lost-report-models';
import { FoundReportListItem, UnifiedReportItem } from '../../reports/data-access/report-models';

export interface PagedReportsQuery {
  page: number;
  pageSize: number;
  speciesId?: string;
  /** Etiqueta de ciudad tal como la guarda el backend (no el slug del select). */
  city?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  /** Filtro de estado (p. ej. 'PUBLISHED' o 'FOUND' en perdidos). */
  status?: string;
}

export interface PagedReportsResult {
  items: UnifiedReportItem[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

/**
 * No expone un feed combinado LOST+FOUND: son tablas distintas en el
 * backend, cada una con su propia paginación real. Combinarlas en el
 * cliente rompe totales/páginas a partir de la página 2. En vez de eso,
 * el consumidor pide explícitamente listLost() o listFound() — la UI
 * los presenta como pestañas separadas (Perdidas / Encontradas).
 */
@Injectable({ providedIn: 'root' })
export class ReportsFacade {
  private readonly lostReports = inject(LostReportsService);
  private readonly foundReports = inject(FoundReportsService);

  listLost(query: PagedReportsQuery): Observable<PagedReportsResult> {
    return this.lostReports
      .list({
        page: query.page,
        pageSize: query.pageSize,
        speciesId: query.speciesId,
        city: query.city,
        sort: query.sort,
        order: query.order,
        status: query.status,
      })
      .pipe(
        map((res) => ({
          items: res.data.items.map((item) => this.toUnifiedLost(item)),
          page: res.data.page,
          pageSize: res.data.page_size,
          total: res.data.total,
          pages: res.data.pages,
        })),
      );
  }

  listFound(query: PagedReportsQuery): Observable<PagedReportsResult> {
    return this.foundReports
      .list({
        page: query.page,
        pageSize: query.pageSize,
        speciesId: query.speciesId,
        city: query.city,
        sort: query.sort,
        order: query.order,
        status: query.status,
      })
      .pipe(
        map((res) => ({
          items: res.data.items.map((item) => this.toUnifiedFound(item)),
          page: res.data.page,
          pageSize: res.data.page_size,
          total: res.data.total,
          pages: res.data.pages,
        })),
      );
  }

  private toUnifiedLost(item: LostReportListItem): UnifiedReportItem {
    return {
      id: item.id,
      kind: 'LOST',
      title: item.title,
      status: item.status,
      city: item.city,
      speciesId: null,
      petId: item.pet_id ?? null,
      date: item.lost_date,
      publishedAt: item.published_at,
      createdBy: item.created_by,
      latitude: item.latitude,
      longitude: item.longitude,
    };
  }

  private toUnifiedFound(item: FoundReportListItem): UnifiedReportItem {
    return {
      id: item.id,
      kind: 'FOUND',
      title: item.title,
      status: item.status,
      city: item.city,
      speciesId: item.species_id,
      date: item.found_date,
      publishedAt: item.published_at,
      createdBy: item.created_by,
      latitude: item.latitude,
      longitude: item.longitude,
    };
  }
}
