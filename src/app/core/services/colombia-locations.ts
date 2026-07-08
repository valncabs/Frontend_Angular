export interface ColombianCity {
  value: string;
  label: string;
}

export interface ColombianDepartment {
  value: string;
  label: string;
  cities: ColombianCity[];
}

export const COLOMBIA_DEPARTMENTS: ColombianDepartment[] = [
  {
    value: 'atlantico',
    label: 'Atlántico',
    cities: [
      { value: 'barranquilla', label: 'Barranquilla' },
      { value: 'soledad', label: 'Soledad' },
      { value: 'malambo', label: 'Malambo' },
      { value: 'sabanalarga', label: 'Sabanalarga' },
    ],
  },
  {
    value: 'cundinamarca',
    label: 'Cundinamarca',
    cities: [
      { value: 'bogota', label: 'Bogotá' },
      { value: 'soacha', label: 'Soacha' },
      { value: 'chia', label: 'Chía' },
      { value: 'zipaquira', label: 'Zipaquirá' },
    ],
  },
  {
    value: 'antioquia',
    label: 'Antioquia',
    cities: [
      { value: 'medellin', label: 'Medellín' },
      { value: 'bello', label: 'Bello' },
      { value: 'itagui', label: 'Itagüí' },
      { value: 'envigado', label: 'Envigado' },
    ],
  },
  {
    value: 'valle_del_cauca',
    label: 'Valle del Cauca',
    cities: [
      { value: 'cali', label: 'Cali' },
      { value: 'palmira', label: 'Palmira' },
      { value: 'buenaventura', label: 'Buenaventura' },
    ],
  },
  {
    value: 'bolivar',
    label: 'Bolívar',
    cities: [
      { value: 'cartagena', label: 'Cartagena' },
      { value: 'magangue', label: 'Magangué' },
    ],
  },
  {
    value: 'santander',
    label: 'Santander',
    cities: [
      { value: 'bucaramanga', label: 'Bucaramanga' },
      { value: 'floridablanca', label: 'Floridablanca' },
      { value: 'giron', label: 'Girón' },
    ],
  },
  {
    value: 'norte_de_santander',
    label: 'Norte de Santander',
    cities: [{ value: 'cucuta', label: 'Cúcuta' }],
  },
  {
    value: 'risaralda',
    label: 'Risaralda',
    cities: [{ value: 'pereira', label: 'Pereira' }],
  },
  {
    value: 'caldas',
    label: 'Caldas',
    cities: [{ value: 'manizales', label: 'Manizales' }],
  },
  {
    value: 'tolima',
    label: 'Tolima',
    cities: [{ value: 'ibague', label: 'Ibagué' }],
  },
];

/** Nombre fijo del país mientras no exista selector dinámico. */
export const DEFAULT_COUNTRY = 'Colombia';
