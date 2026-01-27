import { Routes } from '@angular/router';
import { PollutionComponent } from './features/pollution/pages/pollution/pollution';
import { PollutionList } from './features/pollution/components/pollution-list/pollution-list';
import { PollutionForm } from './features/pollution/components/pollution-form/pollution-form';
import { PollutionDetail } from './features/pollution/components/pollution-detail/pollution-detail';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'pollutions',
    component: PollutionComponent,
    children: [
      {
        path: '',
        component: PollutionList,
      },
      {
        path: 'create',
        component: PollutionForm,
        canActivate: [authGuard]
      },
      {
        path: ':id/edit',
        component: PollutionForm,
        canActivate: [authGuard]
      },
      {
        path: ':id',
        component: PollutionDetail,
      },
    ],
  },
  {
    path: 'favoris',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/favoris/pages/favoris-page/favoris-page').then(m => m.FavorisPageComponent)
  },
  {
    path: 'utilisateurs',
    loadChildren: () =>
      import('./features/utilisateur/routes').then((m) => m.utilisateurRoutes),
    canActivate: [authGuard]
  },
];
