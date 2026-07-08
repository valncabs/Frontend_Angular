export type PetSex = 'MALE' | 'FEMALE' | 'UNKNOWN';
export type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE';

// ---------- Contratos con el backend ----------

export interface CreatePetRequest {
  species_id: string;
  breed_id?: string | null;
  name: string;
  sex: PetSex;
  color: string;
  size: PetSize;
  weight?: number | null;
  approximate_age?: number | null;
  microchip_number?: string | null;
  sterilized: boolean;
  distinctive_marks?: string | null;
  description?: string | null;
}

export type UpdatePetRequest = Partial<CreatePetRequest>;

export interface PetResponse {
  id: string;
  owner_user_id: string;
  species_id: string;
  breed_id: string | null;
  name: string;
  sex: PetSex;
  color: string;
  size: PetSize;
  weight: number | null;
  approximate_age: number | null;
  microchip_number: string | null;
  sterilized: boolean;
  distinctive_marks: string | null;
  description: string | null;
  is_active: boolean;
}

export interface PetListItem {
  id: string;
  species_id: string;
  breed_id: string | null;
  name: string;
  sex: PetSex;
  color: string;
  size: PetSize;
  is_active: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface PetImageResponse {
  id: string;
  entity_type: string;
  entity_id: string;
  url: string;
  mime_type: string;
  file_size: number;
  is_primary: boolean;
}

export interface SpeciesResponse {
  id: string;
  name: string;
}

export interface BreedResponse {
  id: string;
  species_id: string;
  name: string;
}

// ---------- Tipos de UI (usados por los componentes de features/dash) ----------

export interface Species {
  id: string;
  name: string;
}

export interface Breed {
  id: string;
  name: string;
  speciesId: string;
}

export interface Pet {
  id: string;
  speciesId: string;
  speciesName?: string;
  breedId?: string;
  breedName?: string;
  name: string;
  sex: PetSex;
  color: string;
  size: PetSize;
  weight?: number;
  approximateAge?: number;
  sterilized: boolean;
  distinctiveMarks?: string;
  description?: string;
  photoUrl?: string;
}

export type CreatePetDto = CreatePetRequest;

export interface PetFormPayload {
  data: CreatePetDto;
  photo: File | null;
}
