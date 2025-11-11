export interface Pollution {
  id?: number;
  titre: string;
  type_pollution: string;  // Modifié pour correspondre à l'API
  description: string;
  date_observation: Date | string;  // Modifié pour correspondre à l'API
  lieu: string;
  latitude: number;
  longitude: number;
  photo_url?: string;  // Modifié pour correspondre à l'API
}
