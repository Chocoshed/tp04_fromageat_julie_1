import { Routes } from '@angular/router';
import { PollutionComponent } from './features/pollution/pages/pollution/pollution';
import { PollutionList } from './features/pollution/components/pollution-list/pollution-list';
import { PollutionForm } from './features/pollution/components/pollution-form/pollution-form';
import { PollutionDetail } from './features/pollution/components/pollution-detail/pollution-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
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
      },
      {
        path: ':id/edit',
        component: PollutionForm,
      },
      {
        path: ':id',
        component: PollutionDetail,
      },
    ],
  },
  {
    path: 'utilisateurs',
    loadChildren: () =>
      import('./features/utilisateur/routes').then((m) => m.utilisateurRoutes),
  },
];
