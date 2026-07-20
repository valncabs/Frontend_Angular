import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { LostReportsService } from './lost-reports';
import { FoundReportsService } from './found-reports';
import { UnifiedReportItem } from './report-models';

export interface ReportsQuery {
  type: 'ALL' | 'LOST' | 'FOUND';
  speciesId?: string;
  city?: string;
}

@Injectable({ providedIn: 'root' })
export class ReportsFacade {
  private readonly lostReports = inject(LostReportsService);
  private readonly foundReports = inject(FoundReportsService);

  listCombined(query: ReportsQuery): Observable<UnifiedReportItem[]> {
    const lost$ =
      query.type === 'FOUND'
        ? of([] as UnifiedReportItem[])
        : this.lostReports
            .list({ page: 1, pageSize: 50 })
            .pipe(map((res) => res.data.items.map((item) => this.toUnifiedLost(item))));

    const found$ =
      query.type === 'LOST'
        ? of([] as UnifiedReportItem[])
        : this.foundReports
            .list({ page: 1, pageSize: 50, speciesId: query.speciesId, city: query.city })
            .pipe(map((res) => res.data.items.map((item) => this.toUnifiedFound(item))));

    return forkJoin([lost$, found$]).pipe(
      map(([lost, found]) => {
        let filteredLost = lost;
        if (query.city) {
          filteredLost = filteredLost.filter(
            (r) => r.city.toLowerCase() === query.city!.toLowerCase(),
          );
        }
        return [...filteredLost, ...found].sort((a, b) =>
          b.publishedAt.localeCompare(a.publishedAt),
        );
      }),
    );
  }

  private toUnifiedLost(item: any): UnifiedReportItem {
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
    };
  }

  private toUnifiedFound(item: any): UnifiedReportItem {
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
    };
  }
}
