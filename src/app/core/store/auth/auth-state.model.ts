import { Utilisateur } from '../../models/utilisateur.model';

export interface AuthStateModel {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
