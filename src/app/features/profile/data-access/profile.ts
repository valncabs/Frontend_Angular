import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiSuccessResponse } from '../../../core/services/auth.models';
import { CreateProfileRequest, ProfileResponse, UpdateProfileRequest } from './profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users/me/profile`;

  getMyProfile(): Observable<ApiSuccessResponse<ProfileResponse>> {
    return this.http.get<ApiSuccessResponse<ProfileResponse>>(this.baseUrl);
  }

  createProfile(payload: CreateProfileRequest): Observable<ApiSuccessResponse<ProfileResponse>> {
    return this.http.post<ApiSuccessResponse<ProfileResponse>>(this.baseUrl, payload);
  }

  updateProfile(payload: UpdateProfileRequest): Observable<ApiSuccessResponse<ProfileResponse>> {
    return this.http.patch<ApiSuccessResponse<ProfileResponse>>(this.baseUrl, payload);
  }
}
