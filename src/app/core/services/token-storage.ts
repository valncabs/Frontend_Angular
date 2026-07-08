import { Injectable } from '@angular/core';
import { LoginUserData } from './auth.models';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_AT_KEY = 'expires_at';
const USER_KEY = 'user';
const ROL_KEY = 'rol';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  saveSession(
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number,
    user: LoginUserData,
  ): void {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const primaryRole = user.roles.includes('ADMIN') ? 'ADMIN' : (user.roles[0] ?? 'USER');

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROL_KEY, primaryRole);
  }

  updateTokens(accessToken: string, refreshToken: string, expiresInSeconds: number): void {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getUser(): LoginUserData | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as LoginUserData) : null;
  }

  getRol(): string | null {
    return localStorage.getItem(ROL_KEY);
  }

  hasSession(): boolean {
    return !!this.getAccessToken();
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROL_KEY);
  }
}
