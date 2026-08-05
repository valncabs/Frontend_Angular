// ============================================================
// Reports — modelos y contratos
// ============================================================

// ---------- Tipos base ----------
export type ReportKind = 'LOST' | 'FOUND';

/**
 * @deprecated Usa `ReportKind`. Se mantiene como alias temporal porque
 * admin-page.ts (y posiblemente otros) todavía importan `ReportType`.
 * Migrar esos usos y eliminar este alias cuando se pueda.
 */
export type ReportType = ReportKind;

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

// ---------- Modelo unificado (fuente de verdad para report-card, reports-page, etc.) ----------
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
  latitude: number | null;
  longitude: number | null;
}

export interface MyReportItem extends UnifiedReportItem {
  /** Estado crudo del backend (p. ej. 'PUBLISHED'), no la etiqueta legible. */
  rawStatus?: string;
  canMarkAsFound: boolean;
  /** true si el dueño ya solicitó marcar como encontrada (pendiente de admin). */
  foundRequested?: boolean;
}

// ---------- Contratos con el backend: FOUND reports ----------
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
  reporter_name?: string | null;
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
  latitude: number | null;
  longitude: number | null;
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
  latitude: number | null;
  longitude: number | null;
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

// ---------- Legacy: usado hoy por el módulo de admin ----------
// TODO: migrar admin-reportes-page a `UnifiedReportItem` y estos tipos
// eliminarlos. Se conservan tal cual para no romper el admin ahora.

export interface PetReport {
  id: string;
  type: ReportType;
  petName?: string;
  species: string;
  speciesId: string;
  breed?: string;
  sex?: 'MALE' | 'FEMALE';
  color: string;
  size?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
  approximateAge?: number;
  distinctiveMarks?: string;
  description?: string;
  photoUrl?: string;
  reporterName: string;
  reporterPhone?: string;
  city: string;
  neighborhood?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  reportedAt: string;
  lastSeenAt?: string;
}

export interface ReportFilters {
  type: ReportType | 'ALL';
  speciesId: string;
  city: string;
}
