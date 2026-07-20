import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { TokenStorage } from '../services/token-storage';

/** Protege rutas que requieren cualquier usuario autenticado con sesión vigente. */
export const authGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorage);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (tokenStorage.hasValidSession()) {
    return true;
  }

  // Sesión ausente o expirada: limpiar cualquier resto y mandar al landing.
  authService.logout();
  router.navigate(['/home']);
  return false;
};

/** Protege rutas que además requieren rol ADMIN. Usar junto a authGuard. */
export const adminGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorage);
  const router = inject(Router);

  if (tokenStorage.getRol() === 'ADMIN') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};