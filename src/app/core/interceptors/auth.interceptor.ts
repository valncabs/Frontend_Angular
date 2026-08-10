import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth';
import { TokenStorage } from '../services/token-storage';

const PUBLIC_AUTH_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/resend-verification',
]);

let isRefreshing = false;
// Subject compartido: mientras un refresh está en curso, las demás peticiones
// que reciban 401 se encolan aquí esperando el token nuevo. Si el refresh
// FALLA, el subject emite error para que esas peticiones se desbloqueen y
// propaguen el fallo (antes quedaban colgadas para siempre).
let refreshedToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tokenStorage = inject(TokenStorage);

  // Coincidencia exacta sobre el path (sin query string): evita que una ruta
  // como /auth/login marque por error como pública otra que solo la contenga.
  const requestPath = req.url.split('?')[0];
  const isPublicAuthRequest = PUBLIC_AUTH_PATHS.has(requestPath);
  const accessToken = authService.getAccessToken();

  const authorizedReq =
    accessToken && !isPublicAuthRequest
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const shouldTryRefresh =
        error.status === 401 && !isPublicAuthRequest && tokenStorage.hasSession();
      if (!shouldTryRefresh) {
        return throwError(() => error);
      }
      return handleTokenRefresh(req, next, authService, router);
    }),
  );
};

function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshedToken$ = new BehaviorSubject<string | null>(null);

    authService.refreshToken().subscribe({
      next: (response) => {
        refreshedToken$.next(response.data.access_token);
        refreshedToken$.complete();
      },
      error: (refreshError) => {
        authService.logout();
        router.navigate(['/home']);
        refreshedToken$.error(refreshError);
        isRefreshing = false;
      },
      complete: () => {
        isRefreshing = false;
      },
    });
  }

  return refreshedToken$.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
  );
}
