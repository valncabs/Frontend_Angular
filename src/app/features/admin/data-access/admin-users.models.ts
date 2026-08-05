import { DocumentType, Gender } from '../../profile/data-access/profile.models';

export interface AdminUserListItem {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  is_active: boolean;
  email_verified: boolean;
  last_login: string | null;
  created_at: string;
}

export interface AdminUserProfileResponse {
  first_name: string;
  last_name: string;
  document_type: DocumentType;
  document_number: string;
  phone: string;
  birth_date: string | null;
  gender: Gender | null;
  country: string;
  department: string;
  city: string;
  address: string | null;
}

export interface AdminUserDetailResponse {
  id: string;
  email: string;
  role: string | null;
  permissions: string[];
  is_active: boolean;
  email_verified: boolean;
  last_login: string | null;
  created_at: string;
  profile: AdminUserProfileResponse | null;
}

export interface UpdateUserRoleRequest {
  role: string;
}

export interface UpdateUserStatusRequest {
  is_active: boolean;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  document_type: DocumentType;
  document_number: string;
  phone: string;
  country: string;
  department: string;
  city: string;
}

/** Roles disponibles en el sistema. Si agregás más roles en el backend,
 * solo hay que sumarlos acá y en el <select> de la página. */
export const ASSIGNABLE_ROLES = ['ADMIN', 'USER'] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];
