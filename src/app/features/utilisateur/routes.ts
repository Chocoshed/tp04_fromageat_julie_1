import { Routes } from '@angular/router';

export const utilisateurRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/utilisateur-list/utilisateur-list').then((m) => m.UtilisateurList),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/utilisateur-form/utilisateur-form').then((m) => m.UtilisateurForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/utilisateur-detail/utilisateur-detail').then((m) => m.UtilisateurDetail),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/utilisateur-form/utilisateur-form').then((m) => m.UtilisateurForm),
  },
];
