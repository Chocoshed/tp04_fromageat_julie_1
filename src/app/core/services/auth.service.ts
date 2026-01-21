import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';
import { AuthResponse, LoginCredentials, RegisterData } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/utilisateur/register`, data, {
      withCredentials: true
    });
  }

  /**
   * Connexion d'un utilisateur
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/utilisateur/login`, credentials, {
      withCredentials: true
    });
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/utilisateur/logout`, {}, {
      withCredentials: true
    });
  }

  /**
   * Récupérer l'utilisateur connecté depuis l'API
   */
  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/utilisateur/me`, {
      withCredentials: true
    });
  }
}
