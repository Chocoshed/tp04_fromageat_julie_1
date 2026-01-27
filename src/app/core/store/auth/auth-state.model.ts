import { Utilisateur } from '../../models/utilisateur.model';

export interface AuthStateModel {
  user: Utilisateur | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
