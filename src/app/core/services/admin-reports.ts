import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from './auth.models';
import { PaginatedResponse } from './pet.models';
import {
  AdminReportDetail,
  AdminReportListItem,
  AdminReportListParams,
} from './admin-reports.models';
import { LostReportsService } from './lost-reports';
import { FoundReportsService } from './found-reports';
import { PetsService } from './pets';

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private readonly http = inject(HttpClient);
  private readonly lostReports = inject(LostReportsService);
  private readonly foundReports = inject(FoundReportsService);
  private readonly pets = inject(PetsService);
  private readonly baseUrl = `${environment.apiUrl}/admin/reports`;

  list(
    params: AdminReportListParams = {},
  ): Observable<ApiSuccessResponse<PaginatedResponse<AdminReportListItem>>> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 1)
      .set('page_size', params.pageSize ?? 20);

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.reportType) httpParams = httpParams.set('report_type', params.reportType);
    if (params.speciesId) httpParams = httpParams.set('species_id', params.speciesId);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.city) httpParams = httpParams.set('city', params.city);
    if (params.dateFrom) httpParams = httpParams.set('date_from', params.dateFrom);
    if (params.dateTo) httpParams = httpParams.set('date_to', params.dateTo);

    return this.http.get<ApiSuccessResponse<PaginatedResponse<AdminReportListItem>>>(this.baseUrl, {
      params: httpParams,
    });
  }

  /** Trae el detalle completo (info + imágenes de reporte + imágenes de
   * mascota si aplica) cruzando los endpoints existentes de cada tipo.
   * Se usa al expandir una fila de la tabla. */
  getDetail(id: string, kind: 'LOST' | 'FOUND'): Observable<AdminReportDetail> {
    if (kind === 'LOST') {
      return forkJoin({
        report: this.lostReports.getById(id),
        images: this.lostReports.listImages(id),
      }).pipe(
        map(({ report, images }) => {
          const r = report.data;
          return {
            kind: 'LOST',
            id: r.id,
            title: r.title,
            description: r.description,
            status: r.status,
            country: r.country,
            department: r.department,
            city: r.city,
            address: r.address,
            contactPhone: r.contact_phone,
            publishedAt: r.published_at,
            closedAt: r.closed_at,
            createdBy: r.created_by,
            reward: r.reward,
            lostDate: r.lost_date,
            petId: r.pet_id,
            petName: r.pet_name,
            petSpeciesId: r.pet_species_id,
            petBreedId: r.pet_breed_id,
            petSex: r.pet_sex,
            petColor: r.pet_color,
            petSize: r.pet_size,
            petApproximateAge: r.pet_approximate_age,
            petDistinctiveMarks: r.pet_distinctive_marks,
            reportImages: images.data,
            petImages: [],
          } as AdminReportDetail;
        }),
      );
    }

    return forkJoin({
      report: this.foundReports.getById(id),
      images: this.foundReports.listImages(id),
    }).pipe(
      map(({ report, images }) => {
        const r = report.data;
        return {
          kind: 'FOUND',
          id: r.id,
          title: r.title,
          description: r.description,
          status: r.status,
          country: r.country,
          department: r.department,
          city: r.city,
          address: r.address,
          contactPhone: r.contact_phone,
          publishedAt: r.published_at,
          closedAt: r.closed_at,
          createdBy: r.created_by,
          foundDate: r.found_date,
          speciesId: r.species_id,
          lostReportId: r.lost_report_id,
          approvedAt: r.approved_at,
          reportImages: images.data,
          petImages: [],
        } as AdminReportDetail;
      }),
    );
  }
  /** Fotos de la mascota original, solo tiene sentido para LOST. Separado
   * de getDetail() para no acoplar el fetch de pet-images al de reporte. */
  getPetImages(petId: string) {
    return this.pets.listImages(petId).pipe(map((res) => res.data));
  }
}
