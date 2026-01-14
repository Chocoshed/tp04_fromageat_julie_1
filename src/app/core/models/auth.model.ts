import { Utilisateur } from './utilisateur.model';

export interface AuthResponse {
  user: Utilisateur;
  token: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom?: string;
  login: string;
  pass: string;
}
