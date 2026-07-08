import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorage } from './token-storage';
import {
  ApiSuccessResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LoginUserData,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly currentUserSignal = signal<LoginUserData | null>(this.tokenStorage.getUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(payload: LoginRequest): Observable<ApiSuccessResponse<LoginResponse>> {
    return this.http.post<ApiSuccessResponse<LoginResponse>>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => {
        const { access_token, refresh_token, expires_in, user } = response.data;
        this.tokenStorage.saveSession(access_token, refresh_token, expires_in, user);
        this.currentUserSignal.set(user);
      }),
    );
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
        }),
      );
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${this.baseUrl}/forgot-password`, payload);
  }

  logout(): void {
    const refreshToken = this.tokenStorage.getRefreshToken();
    this.tokenStorage.clear();
    this.currentUserSignal.set(null);

    if (refreshToken) {
      this.http
        .post(`${this.baseUrl}/logout`, { refresh_token: refreshToken })
        .subscribe({ error: () => {} });
    }
  }

  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  hasSession(): boolean {
    return this.tokenStorage.hasSession();
  }

  getPrimaryRole(): string | null {
    return this.tokenStorage.getRol();
  }
}
