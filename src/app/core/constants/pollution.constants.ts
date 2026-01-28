/**
 * Constantes métier pour la gestion des pollutions
 * Centralisation des valeurs utilisées dans l'application
 */

/**
 * Types de pollution disponibles dans l'application
 */
export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre'
] as const;

/**
 * Type TypeScript pour les types de pollution
 * Permet l'auto-complétion et la validation à la compilation
 */
export type PollutionType = typeof POLLUTION_TYPES[number];

/**
 * Statuts de filtrage disponibles
 */
export const POLLUTION_FILTER_STATUS = {
  ALL: 'toutes',
  MINE: 'miennes',
  FAVORITES: 'favoris'
} as const;

/**
 * Limites de validation
 */
export const POLLUTION_VALIDATION = {
  TITRE_MIN_LENGTH: 3,
  DESCRIPTION_MIN_LENGTH: 10,
  LIEU_MIN_LENGTH: 3,
  LATITUDE_MIN: -90,
  LATITUDE_MAX: 90,
  LONGITUDE_MIN: -180,
  LONGITUDE_MAX: 180,
  DATE_MAX_YEARS_AGO: 10
} as const;

/**
 * Configuration de la recherche
 */
export const SEARCH_CONFIG = {
  DEBOUNCE_TIME: 300, // ms
  MIN_SEARCH_LENGTH: 0
} as const;
