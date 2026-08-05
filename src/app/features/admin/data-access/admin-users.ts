import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiSuccessResponse } from '../../../core/services/auth.models';
import { PaginatedResponse } from '../../pets/data-access/pet.models';
import {
  AdminUserDetailResponse,
  AdminUserListItem,
  CreateAdminRequest,
} from './admin-users.models';

export interface AdminUserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/users`;

  list(
    params: AdminUserListParams = {},
  ): Observable<ApiSuccessResponse<PaginatedResponse<AdminUserListItem>>> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 1)
      .set('page_size', params.pageSize ?? 20);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.role) httpParams = httpParams.set('role', params.role);
    if (params.isActive !== undefined) httpParams = httpParams.set('is_active', params.isActive);

    return this.http.get<ApiSuccessResponse<PaginatedResponse<AdminUserListItem>>>(this.baseUrl, {
      params: httpParams,
    });
  }

  getById(id: string): Observable<ApiSuccessResponse<AdminUserDetailResponse>> {
    return this.http.get<ApiSuccessResponse<AdminUserDetailResponse>>(`${this.baseUrl}/${id}`);
  }

  updateRole(id: string, role: string): Observable<ApiSuccessResponse<AdminUserDetailResponse>> {
    return this.http.patch<ApiSuccessResponse<AdminUserDetailResponse>>(
      `${this.baseUrl}/${id}/role`,
      { role },
    );
  }

  updateStatus(
    id: string,
    isActive: boolean,
  ): Observable<ApiSuccessResponse<AdminUserDetailResponse>> {
    return this.http.patch<ApiSuccessResponse<AdminUserDetailResponse>>(
      `${this.baseUrl}/${id}/status`,
      { is_active: isActive },
    );
  }

  createAdmin(
    payload: CreateAdminRequest,
  ): Observable<ApiSuccessResponse<AdminUserDetailResponse>> {
    return this.http.post<ApiSuccessResponse<AdminUserDetailResponse>>(this.baseUrl, payload);
  }
}
