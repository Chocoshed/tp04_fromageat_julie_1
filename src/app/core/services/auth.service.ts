import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';
import { AuthResponse, LoginCredentials, RegisterData } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    // Initialiser l'état au chargement
    this.checkAuthStatus();
  }

  /**
   * Vérifier si l'utilisateur est connecté au chargement
   */
  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      // Vérifier que le token est valide en récupérant l'utilisateur
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          // Token invalide ou expiré
          this.logout();
        }
      });
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/utilisateur/register`, data).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Connexion d'un utilisateur
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/utilisateur/login`, credentials).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Récupérer le token depuis localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Sauvegarder le token dans localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Récupérer l'utilisateur connecté depuis l'API
   */
  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/utilisateur/me`);
  }

  /**
   * Vérifier si l'utilisateur est authentifié (synchrone)
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
