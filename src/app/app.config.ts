import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';

const API_URL = 'http://localhost:3000/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: 'API_URL', useValue: API_URL }, // Fournir l'URL de l'API comme dépendance injectable
    importProvidersFrom(HttpClientModule) // Importer HttpClientModule pour activer HttpClient
  ]
};
