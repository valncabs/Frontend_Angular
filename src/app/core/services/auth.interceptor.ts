import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth';

const PUBLIC_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/resend-verification',
];

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) => req.url.includes(path));
  const accessToken = authService.getAccessToken();

  const authorizedReq =
    accessToken && !isPublicAuthRequest
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const shouldTryRefresh =
        error.status === 401 && !isPublicAuthRequest && authService.hasSession();
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
    refreshedToken$.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        const newToken = response.data.access_token;
        refreshedToken$.next(newToken);
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => refreshError);
      }),
    );
  }

  return refreshedToken$.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
  );
}
