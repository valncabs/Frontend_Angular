import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorage } from './token-storage';

import {
  ApiSuccessResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LoginUserData,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from './auth.models';
import { MeResponse } from './auth.models';
import { DeleteAccountRequest } from './auth.models';

/** Margen de seguridad: refrescar el token este tiempo antes de que expire,
 * para no dejar ventanas donde el access token ya caducó. */
const REFRESH_BUFFER_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 5_000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly currentUserSignal = signal<LoginUserData | null>(this.tokenStorage.getUser());
  private refreshTimerId: ReturnType<typeof setTimeout> | null = null;

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly profileCompleted = computed(() => this.currentUserSignal()?.profile_completed ?? false);

  constructor() {
    // Al recargar la app (F5, nueva pestaña), retomar el ciclo de refresco
    // si la sesión guardada sigue siendo válida; si ya expiró, limpiar.
    if (this.tokenStorage.hasValidSession()) {
      const expiresAt = this.tokenStorage.getExpiresAt();
      if (expiresAt) this.scheduleRefresh(expiresAt);
    } else if (this.tokenStorage.hasSession()) {
      this.logout();
    }
  }

  login(payload: LoginRequest): Observable<ApiSuccessResponse<LoginResponse>> {
    return this.http.post<ApiSuccessResponse<LoginResponse>>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => {
        const { access_token, refresh_token, expires_in, user } = response.data;
        this.tokenStorage.saveSession(access_token, refresh_token, expires_in, user);
        this.currentUserSignal.set(user);
        this.scheduleRefresh(Date.now() + expires_in * 1000);
      }),
    );
  }

  register(payload: RegisterRequest): Observable<ApiSuccessResponse<RegisterResponse>> {
    return this.http.post<ApiSuccessResponse<RegisterResponse>>(
      `${this.baseUrl}/register`,
      payload,
    );
  }

  verifyEmail(payload: VerifyEmailRequest): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${this.baseUrl}/verify-email`, payload);
  }

  resendVerification(payload: ResendVerificationRequest): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${this.baseUrl}/resend-verification`, payload);
  }

  refreshToken(): Observable<ApiSuccessResponse<RefreshTokenResponse>> {
    const payload: RefreshTokenRequest = {
      refresh_token: this.tokenStorage.getRefreshToken() ?? '',
    };
    return this.http
      .post<ApiSuccessResponse<RefreshTokenResponse>>(`${this.baseUrl}/refresh`, payload)
      .pipe(
        tap((response) => {
          const { access_token, refresh_token, expires_in } = response.data;
          this.tokenStorage.updateTokens(access_token, refresh_token, expires_in);
          this.scheduleRefresh(Date.now() + expires_in * 1000);
        }),
      );
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${this.baseUrl}/forgot-password`, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${this.baseUrl}/reset-password`, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${this.baseUrl}/change-password`, payload);
  }

  logout(): void {
    this.clearRefreshTimer();
    const refreshToken = this.tokenStorage.getRefreshToken();
    this.tokenStorage.clear();
    this.currentUserSignal.set(null);

    if (refreshToken) {
      this.http
        .post(`${this.baseUrl}/logout`, { refresh_token: refreshToken })
        .subscribe({ error: () => {} });
    }
  }

  markProfileCompleted(): void {
    const user = this.currentUserSignal();
    if (!user) return;
    const updated: LoginUserData = { ...user, profile_completed: true };
    this.tokenStorage.setUser(updated);
    this.currentUserSignal.set(updated);
  }

  refreshMe(): Observable<ApiSuccessResponse<MeResponse>> {
    return this.http.get<ApiSuccessResponse<MeResponse>>(`${this.baseUrl}/me`).pipe(
      tap((response) => {
        this.tokenStorage.setUser(response.data);
        this.currentUserSignal.set(response.data);
      }),
    );
  }
  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  hasSession(): boolean {
    return this.tokenStorage.hasValidSession();
  }

  getPrimaryRole(): string | null {
    return this.tokenStorage.getRol();
  }

  /** Programa el próximo refresco `REFRESH_BUFFER_MS` antes de que expire
   * el access token actual, para mantener la sesión activa mientras la
   * pestaña siga abierta. Si el refresh falla (refresh token revocado o
   * expirado), se cierra la sesión y se redirige al landing. */
  private scheduleRefresh(expiresAtMs: number): void {
    this.clearRefreshTimer();
    const delay = Math.max(expiresAtMs - Date.now() - REFRESH_BUFFER_MS, MIN_REFRESH_DELAY_MS);

    this.refreshTimerId = setTimeout(() => {
      if (!this.tokenStorage.hasSession()) return;

      this.refreshToken().subscribe({
        error: () => {
          this.logout();
          this.router.navigate(['/home']);
        },
      });
    }, delay);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimerId) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }

  deleteAccount(payload: DeleteAccountRequest): Observable<ApiSuccessResponse<null>> {
    return this.http
      .delete<ApiSuccessResponse<null>>(`${this.baseUrl}/me`, { body: payload })
      .pipe(tap(() => this.logout()));
  }
}
