import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from './auth.models';
import { BreedResponse, SpeciesResponse } from '../../features/pets/data-access/pet.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/catalog`;

  listSpecies(): Observable<ApiSuccessResponse<SpeciesResponse[]>> {
    return this.http.get<ApiSuccessResponse<SpeciesResponse[]>>(`${this.baseUrl}/species`);
  }

  listBreeds(speciesId: string): Observable<ApiSuccessResponse<BreedResponse[]>> {
    return this.http.get<ApiSuccessResponse<BreedResponse[]>>(
      `${this.baseUrl}/species/${speciesId}/breeds`,
    );
  }
}
