import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from './auth.models';
import {
  CreatePetRequest,
  PaginatedResponse,
  PetImageResponse,
  PetListItem,
  PetResponse,
  UpdatePetRequest,
} from './pet.models';

@Injectable({ providedIn: 'root' })
export class PetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pets`;

  create(payload: CreatePetRequest): Observable<ApiSuccessResponse<PetResponse>> {
    return this.http.post<ApiSuccessResponse<PetResponse>>(this.baseUrl, payload);
  }

  listMine(
    page = 1,
    pageSize = 50,
  ): Observable<ApiSuccessResponse<PaginatedResponse<PetListItem>>> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize);
    return this.http.get<ApiSuccessResponse<PaginatedResponse<PetListItem>>>(this.baseUrl, {
      params,
    });
  }

  getById(petId: string): Observable<ApiSuccessResponse<PetResponse>> {
    return this.http.get<ApiSuccessResponse<PetResponse>>(`${this.baseUrl}/${petId}`);
  }

  update(petId: string, payload: UpdatePetRequest): Observable<ApiSuccessResponse<PetResponse>> {
    return this.http.patch<ApiSuccessResponse<PetResponse>>(`${this.baseUrl}/${petId}`, payload);
  }

  delete(petId: string): Observable<ApiSuccessResponse<null>> {
    return this.http.delete<ApiSuccessResponse<null>>(`${this.baseUrl}/${petId}`);
  }

  uploadImage(
    petId: string,
    file: File,
    isPrimary = true,
  ): Observable<ApiSuccessResponse<PetImageResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams().set('is_primary', String(isPrimary));
    return this.http.post<ApiSuccessResponse<PetImageResponse>>(
      `${this.baseUrl}/${petId}/images`,
      formData,
      { params },
    );
  }

  listImages(petId: string): Observable<ApiSuccessResponse<PetImageResponse[]>> {
    return this.http.get<ApiSuccessResponse<PetImageResponse[]>>(`${this.baseUrl}/${petId}/images`);
  }

  deleteImage(petId: string, imageId: string): Observable<ApiSuccessResponse<null>> {
    return this.http.delete<ApiSuccessResponse<null>>(`${this.baseUrl}/${petId}/images/${imageId}`);
  }
}
