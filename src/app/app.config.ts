import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideStore } from '@ngxs/store';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { AuthState } from './core/store/auth/auth.state';
import { PollutionState } from './core/store/pollution/pollution.state';
import { FavorisState } from './core/state/favoris/favoris.state';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

const API_URL = environment.apiUrl;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: 'API_URL', useValue: API_URL }, // Fournir l'URL de l'API comme dépendance injectable
    provideHttpClient(withInterceptors([authInterceptor])), // Activer HttpClient avec l'intercepteur d'authentification
    provideStore(
      [AuthState, PollutionState, FavorisState],
      withNgxsLoggerPlugin(),
      withNgxsReduxDevtoolsPlugin()
    )
  ]
};
