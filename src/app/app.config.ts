import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { routes } from './app.routes';

// TODO : Utilisation de l'environnement Angular pour configurer l'URL de l'API selon l'environnement (dev/prod).
const API_URL = 'http://localhost:3000/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: 'API_URL', useValue: API_URL }, // Fournir l'URL de l'API comme dépendance injectable
    provideHttpClient(withInterceptors([authInterceptor])) // Activer HttpClient avec l'intercepteur d'authentification
  ]
};
