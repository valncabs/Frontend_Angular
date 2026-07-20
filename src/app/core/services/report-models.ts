export type ReportKind = 'LOST' | 'FOUND';
export type LostReportStatus = 'PUBLISHED' | 'FOUND' | 'CLOSED';
export type FoundReportStatus = 'PUBLISHED' | 'MATCHED' | 'APPROVED' | 'REJECTED' | 'CLOSED';

export const LOST_STATUS_LABELS: Record<LostReportStatus, string> = {
  PUBLISHED: 'Activo - Buscando',
  FOUND: 'Encontrada',
  CLOSED: 'Cerrado',
};

export const FOUND_STATUS_LABELS: Record<FoundReportStatus, string> = {
  PUBLISHED: 'Pendiente de revisión',
  MATCHED: 'Posible coincidencia',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CLOSED: 'Cerrado',
};

export interface UnifiedReportItem {
  id: string;
  kind: ReportKind;
  title: string;
  status: string;
  city: string;
  speciesId: string | null;
  petId?: string | null;
  date: string;
  publishedAt: string;
  photoUrl?: string;
  createdBy: string;
}

export interface MyReportItem extends UnifiedReportItem {
  canMarkAsFound: boolean;
}

export interface CreateFoundReportRequest {
  species_id: string;
  lost_report_id?: string | null;
  title: string;
  description?: string | null;
  found_date: string;
  contact_phone?: string | null;
  country: string;
  department: string;
  city: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type UpdateFoundReportRequest = Partial<
  Omit<CreateFoundReportRequest, 'species_id' | 'lost_report_id'>
>;

export interface FoundReportResponse {
  id: string;
  created_by: string;
  species_id: string | null;
  lost_report_id: string | null;
  title: string;
  description: string | null;
  status: FoundReportStatus;
  found_date: string;
  contact_phone: string | null;
  country: string;
  department: string;
  city: string;
  address: string | null;
  approved_by: string | null;
  approved_at: string | null;
  owner_confirmed_at: string | null;
  published_at: string;
  closed_at: string | null;
}

export interface FoundReportListItem {
  id: string;
  created_by: string;
  species_id: string | null;
  title: string;
  status: FoundReportStatus;
  city: string;
  found_date: string;
  published_at: string;
}

export interface FoundReportImageResponse {
  id: string;
  entity_type: string;
  entity_id: string;
  url: string;
  mime_type: string;
  file_size: number;
  is_primary: boolean;
}
