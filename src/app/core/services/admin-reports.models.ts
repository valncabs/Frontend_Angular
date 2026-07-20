import { FoundReportImageResponse } from './report-models';
import { LostReportImageResponse } from './lost-report-models';

export type AdminReportKind = 'LOST' | 'FOUND';

/** Fila de la tabla — lo que devuelve /admin/reports (liviano). */
export interface AdminReportListItem {
  id: string;
  type: AdminReportKind;
  created_by: string;
  title: string;
  status: string;
  city: string;
  date: string;
  published_at: string;
}

export interface AdminReportListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  reportType?: AdminReportKind;
  speciesId?: string;
  status?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
}

/** Detalle completo armado en el frontend cruzando lost/found + pets. */
export interface AdminReportDetail {
  kind: AdminReportKind;
  id: string;
  title: string;
  description: string | null;
  status: string;
  country: string;
  department: string;
  city: string;
  address: string | null;
  contactPhone: string | null;
  publishedAt: string;
  closedAt: string | null;
  createdBy: string;

  // Solo LOST
  reward?: number | null;
  lostDate?: string;
  petId?: string;
  petName?: string;
  petSpeciesId?: string;
  petBreedId?: string | null;
  petSex?: string;
  petColor?: string;
  petSize?: string;
  petApproximateAge?: number | null;
  petDistinctiveMarks?: string | null;

  // Solo FOUND
  foundDate?: string;
  speciesId?: string | null;
  lostReportId?: string | null;
  approvedAt?: string | null;

  reportImages: (LostReportImageResponse | FoundReportImageResponse)[];
  petImages: FoundReportImageResponse[]; // mismo shape que las de pet.models
}
