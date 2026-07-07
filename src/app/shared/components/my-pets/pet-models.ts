export type PetSex = 'MALE' | 'FEMALE';
export type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';

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

export interface CreatePetDto {
  species_id: string;
  breed_id?: string;
  name: string;
  sex: PetSex;
  color: string;
  size: PetSize;
  weight?: number;
  approximate_age?: number;
  sterilized: boolean;
  distinctive_marks?: string;
  description?: string;
}

export interface PetFormPayload {
  data: CreatePetDto;
  photo?: File | null;
}
