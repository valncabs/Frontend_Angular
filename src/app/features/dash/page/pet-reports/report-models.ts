export type ReportType = 'LOST' | 'FOUND';

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

export interface ColombianCity {
  value: string;
  label: string;
  department: string;
}

export const COLOMBIAN_CITIES: ColombianCity[] = [
  { value: 'bogota', label: 'Bogotá', department: 'Cundinamarca' },
  { value: 'medellin', label: 'Medellín', department: 'Antioquia' },
  { value: 'cali', label: 'Cali', department: 'Valle del Cauca' },
  { value: 'barranquilla', label: 'Barranquilla', department: 'Atlántico' },
  { value: 'cartagena', label: 'Cartagena', department: 'Bolívar' },
  { value: 'cucuta', label: 'Cúcuta', department: 'Norte de Santander' },
  { value: 'bucaramanga', label: 'Bucaramanga', department: 'Santander' },
  { value: 'pereira', label: 'Pereira', department: 'Risaralda' },
  { value: 'manizales', label: 'Manizales', department: 'Caldas' },
  { value: 'ibague', label: 'Ibagué', department: 'Tolima' },
  { value: 'santa_marta', label: 'Santa Marta', department: 'Magdalena' },
  { value: 'villavicencio', label: 'Villavicencio', department: 'Meta' },
  { value: 'pasto', label: 'Pasto', department: 'Nariño' },
  { value: 'monteria', label: 'Montería', department: 'Córdoba' },
  { value: 'valledupar', label: 'Valledupar', department: 'Cesar' },
];
