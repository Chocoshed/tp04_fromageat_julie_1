import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';
import { Logout } from '../store/auth/auth.actions';

/**
 * Intercepteur HTTP pour ajouter automatiquement le token JWT aux requêtes
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const router = inject(Router);
  const token = store.selectSnapshot(AuthState.token);

  // Cloner la requête et ajouter le header Authorization si le token existe
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Gérer les erreurs 401 (non autorisé)
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token invalide ou expiré, déconnecter l'utilisateur
        store.dispatch(new Logout());
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
