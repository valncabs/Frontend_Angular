import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { filter, map, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoading$.pipe(
    filter((isLoading) => !isLoading),
    switchMap(() => auth.idTokenClaims$),
    map((claims) => {
      if (!claims) {
        auth.loginWithRedirect({ appState: { target: '/dashboard' } });
        return false;
      }

      const roles: string[] = claims['https://pet-centric.com/roles'] ?? [];
      const currentPath = route.routeConfig?.path;

      if (roles.includes('admin')) {
        if (currentPath === 'admin') return true;
        router.navigate(['/admin']);
        return false;
      }

      if (roles.includes('user')) {
        if (currentPath === 'admin') {
          router.navigate(['/dashboard']);
          return false;
        }
        return true;
      }

      auth.loginWithRedirect();
      return false;
    }),
  );
};
