import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Intercepteur HTTP pour ajouter automatiquement le token JWT aux requêtes
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

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
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
