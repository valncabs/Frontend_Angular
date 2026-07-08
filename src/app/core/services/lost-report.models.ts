export type LostReportStatus = 'PUBLISHED' | 'FOUND' | 'CLOSED';

export const LOST_REPORT_STATUS_LABELS: Record<LostReportStatus, string> = {
  PUBLISHED: 'Activo',
  FOUND: 'Encontrada',
  CLOSED: 'Cerrado',
};

// ---------- Contratos con el backend ----------

export interface CreateLostReportRequest {
  pet_id: string;
  title: string;
  description?: string | null;
  lost_date: string; // formato 'YYYY-MM-DD'
  reward?: number | null;
  contact_phone?: string | null;
  country: string;
  department: string;
  city: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type UpdateLostReportRequest = Partial<Omit<CreateLostReportRequest, 'pet_id'>>;

export interface LostReportResponse {
  id: string;
  pet_id: string;
  created_by: string;
  title: string;
  description: string | null;
  status: LostReportStatus;
  lost_date: string;
  reward: number | null;
  contact_phone: string | null;
  country: string;
  department: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  published_at: string;
  closed_at: string | null;
}

export interface LostReportListItem {
  id: string;
  pet_id: string;
  title: string;
  status: LostReportStatus;
  city: string;
  lost_date: string;
  published_at: string;
}

export interface LostReportImageResponse {
  id: string;
  entity_type: string;
  entity_id: string;
  url: string;
  mime_type: string;
  file_size: number;
  is_primary: boolean;
}

// ---------- Tipos de UI ----------

export interface LostReportFormPayload {
  data: CreateLostReportRequest;
  photo: File | null;
}

export function normalizeLostReportResponse(raw: LostReportResponse): LostReportResponse {
  return {
    ...raw,
    reward: raw.reward !== null && raw.reward !== undefined ? Number(raw.reward) : null,
    latitude: raw.latitude !== null && raw.latitude !== undefined ? Number(raw.latitude) : null,
    longitude: raw.longitude !== null && raw.longitude !== undefined ? Number(raw.longitude) : null,
  };
}
