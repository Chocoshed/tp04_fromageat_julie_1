import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';
import { map, take } from 'rxjs/operators';

/**
 * Guard pour protéger les routes qui nécessitent une authentification
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Attendre que le loading soit terminé avant de vérifier l'authentification
  return store.select(AuthState.loading).pipe(
    take(1),
    map(loading => {
      if (!loading) {
        const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

        if (isAuthenticated) {
          return true;
        }

        // Rediriger vers la page de login si non authentifié
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // Si loading, on retente après un délai
      setTimeout(() => {
        const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);
        if (!isAuthenticated) {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }
      }, 100);

      return store.selectSnapshot(AuthState.isAuthenticated);
    })
  );
};
