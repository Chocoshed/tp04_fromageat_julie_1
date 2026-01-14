import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';

/**
 * Guard pour protéger les routes qui nécessitent une authentification
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

  if (isAuthenticated) {
    return true;
  }

  // Rediriger vers la page de login si non authentifié
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
