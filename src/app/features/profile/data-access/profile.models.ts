export type DocumentType = 'CC' | 'CE' | 'TI' | 'PASSPORT';
export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface CreateProfileRequest {
  document_type: DocumentType;
  document_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  birth_date: string | null;
  gender: Gender | null;
  country: string;
  department: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export type UpdateProfileRequest = Partial<CreateProfileRequest>;

export interface ProfileResponse {
  user_id: string;
  document_type: DocumentType;
  document_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  birth_date: string | null;
  gender: Gender | null;
  country: string;
  department: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}
