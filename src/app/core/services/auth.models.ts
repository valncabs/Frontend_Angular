export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserData {
  id: string;
  email: string;
  email_verified: boolean;
  roles: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: LoginUserData;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}
