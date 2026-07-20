import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from './auth.models';
import { PaginatedResponse } from './pet.models';
import {
  CreateFoundReportRequest,
  FoundReportImageResponse,
  FoundReportListItem,
  FoundReportResponse,
  UpdateFoundReportRequest,
} from './report-models';

export interface FoundReportListParams {
  page?: number;
  pageSize?: number;
  speciesId?: string;
  city?: string;
  status?: string;
  lostReportId?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable({ providedIn: 'root' })
export class FoundReportsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/found-reports`;

  create(payload: CreateFoundReportRequest): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.post<ApiSuccessResponse<FoundReportResponse>>(this.baseUrl, payload);
  }

  list(
    params: FoundReportListParams = {},
  ): Observable<ApiSuccessResponse<PaginatedResponse<FoundReportListItem>>> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 1)
      .set('page_size', params.pageSize ?? 20);
    if (params.speciesId) httpParams = httpParams.set('species_id', params.speciesId);
    if (params.city) httpParams = httpParams.set('city', params.city);
    if (params.status) httpParams = httpParams.set('status_filter', params.status);
    if (params.lostReportId) httpParams = httpParams.set('lost_report_id', params.lostReportId);
    if (params.dateFrom) httpParams = httpParams.set('date_from', params.dateFrom);
    if (params.dateTo) httpParams = httpParams.set('date_to', params.dateTo);

    return this.http.get<ApiSuccessResponse<PaginatedResponse<FoundReportListItem>>>(this.baseUrl, {
      params: httpParams,
    });
  }

  mine(): Observable<ApiSuccessResponse<PaginatedResponse<FoundReportListItem>>> {
    return this.http.get<ApiSuccessResponse<PaginatedResponse<FoundReportListItem>>>(
      `${this.baseUrl}/mine`,
    );
  }

  /** Todos los avistamientos de un reporte de pérdida específico, sin
   * paginar — usado en el modal grande de "Mis reportes". */
  listByLostReport(lostReportId: string): Observable<ApiSuccessResponse<FoundReportResponse[]>> {
    return this.http.get<ApiSuccessResponse<FoundReportResponse[]>>(
      `${this.baseUrl}/by-lost-report/${lostReportId}`,
    );
  }

  getById(id: string): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.get<ApiSuccessResponse<FoundReportResponse>>(`${this.baseUrl}/${id}`);
  }

  update(
    id: string,
    payload: UpdateFoundReportRequest,
  ): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.patch<ApiSuccessResponse<FoundReportResponse>>(
      `${this.baseUrl}/${id}`,
      payload,
    );
  }

  delete(id: string): Observable<ApiSuccessResponse<null>> {
    return this.http.delete<ApiSuccessResponse<null>>(`${this.baseUrl}/${id}`);
  }

  // ---------- Flujo de coincidencia (dueño del lost_report) ----------

  match(reportId: string): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.post<ApiSuccessResponse<FoundReportResponse>>(
      `${this.baseUrl}/${reportId}/match`,
      {},
    );
  }

  unmatch(reportId: string): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.post<ApiSuccessResponse<FoundReportResponse>>(
      `${this.baseUrl}/${reportId}/unmatch`,
      {},
    );
  }

  confirmFound(reportId: string): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.post<ApiSuccessResponse<FoundReportResponse>>(
      `${this.baseUrl}/${reportId}/confirm-found`,
      {},
    );
  }

  // ---------- Aprobación / rechazo (admin) ----------

  approve(reportId: string): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.post<ApiSuccessResponse<FoundReportResponse>>(
      `${this.baseUrl}/${reportId}/approve`,
      {},
    );
  }

  reject(reportId: string): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.post<ApiSuccessResponse<FoundReportResponse>>(
      `${this.baseUrl}/${reportId}/reject`,
      {},
    );
  }

  adminClose(reportId: string): Observable<ApiSuccessResponse<FoundReportResponse>> {
    return this.http.post<ApiSuccessResponse<FoundReportResponse>>(
      `${this.baseUrl}/${reportId}/admin-close`,
      {},
    );
  }

  adminDelete(reportId: string): Observable<ApiSuccessResponse<null>> {
    return this.http.delete<ApiSuccessResponse<null>>(`${this.baseUrl}/${reportId}/admin-delete`);
  }
  uploadImage(
    reportId: string,
    file: File,
    isPrimary = true,
  ): Observable<ApiSuccessResponse<FoundReportImageResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams().set('is_primary', String(isPrimary));
    return this.http.post<ApiSuccessResponse<FoundReportImageResponse>>(
      `${this.baseUrl}/${reportId}/images`,
      formData,
      { params },
    );
  }

  listImages(reportId: string): Observable<ApiSuccessResponse<FoundReportImageResponse[]>> {
    return this.http.get<ApiSuccessResponse<FoundReportImageResponse[]>>(
      `${this.baseUrl}/${reportId}/images`,
    );
  }
}
