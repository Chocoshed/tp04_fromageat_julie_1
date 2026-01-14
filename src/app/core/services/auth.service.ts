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
    return this.http.post<AuthResponse>(`${this.apiUrl}/utilisateur/register`, data);
  }

  /**
   * Connexion d'un utilisateur
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/utilisateur/login`, credentials);
  }

  /**
   * Récupérer le token depuis localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Récupérer l'utilisateur connecté depuis l'API
   */
  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/utilisateur/me`);
  }
}
