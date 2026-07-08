import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from './auth.models';
import { PaginatedResponse } from './pet.models';
import {
  CreateLostReportRequest,
  LostReportImageResponse,
  LostReportListItem,
  LostReportResponse,
  UpdateLostReportRequest,
  normalizeLostReportResponse,
} from './lost-report.models';

export interface LostReportListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class LostReportsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/lost-reports`;

  create(payload: CreateLostReportRequest): Observable<ApiSuccessResponse<LostReportResponse>> {
    return this.http
      .post<ApiSuccessResponse<LostReportResponse>>(this.baseUrl, payload)
      .pipe(map((res) => ({ ...res, data: normalizeLostReportResponse(res.data) })));
  }

  list(
    params: LostReportListParams = {},
  ): Observable<ApiSuccessResponse<PaginatedResponse<LostReportListItem>>> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 1)
      .set('page_size', params.pageSize ?? 20);

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);

    return this.http.get<ApiSuccessResponse<PaginatedResponse<LostReportListItem>>>(this.baseUrl, {
      params: httpParams,
    });
  }

  getById(reportId: string): Observable<ApiSuccessResponse<LostReportResponse>> {
    return this.http
      .get<ApiSuccessResponse<LostReportResponse>>(`${this.baseUrl}/${reportId}`)
      .pipe(map((res) => ({ ...res, data: normalizeLostReportResponse(res.data) })));
  }

  update(
    reportId: string,
    payload: UpdateLostReportRequest,
  ): Observable<ApiSuccessResponse<LostReportResponse>> {
    return this.http
      .patch<ApiSuccessResponse<LostReportResponse>>(`${this.baseUrl}/${reportId}`, payload)
      .pipe(map((res) => ({ ...res, data: normalizeLostReportResponse(res.data) })));
  }

  markAsFound(reportId: string): Observable<ApiSuccessResponse<LostReportResponse>> {
    return this.http.post<ApiSuccessResponse<LostReportResponse>>(
      `${this.baseUrl}/${reportId}/mark-as-found`,
      {},
    );
  }

  close(reportId: string): Observable<ApiSuccessResponse<LostReportResponse>> {
    return this.http.post<ApiSuccessResponse<LostReportResponse>>(
      `${this.baseUrl}/${reportId}/close`,
      {},
    );
  }

  uploadImage(
    reportId: string,
    file: File,
    isPrimary = true,
  ): Observable<ApiSuccessResponse<LostReportImageResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams().set('is_primary', String(isPrimary));
    return this.http.post<ApiSuccessResponse<LostReportImageResponse>>(
      `${this.baseUrl}/${reportId}/images`,
      formData,
      { params },
    );
  }

  listImages(reportId: string): Observable<ApiSuccessResponse<LostReportImageResponse[]>> {
    return this.http.get<ApiSuccessResponse<LostReportImageResponse[]>>(
      `${this.baseUrl}/${reportId}/images`,
    );
  }

  deleteImage(reportId: string, imageId: string): Observable<ApiSuccessResponse<null>> {
    return this.http.delete<ApiSuccessResponse<null>>(
      `${this.baseUrl}/${reportId}/images/${imageId}`,
    );
  }
}
