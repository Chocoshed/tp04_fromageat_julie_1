import { Injectable, Inject } from '@angular/core';
import { Utilisateur } from '../models/utilisateur.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) {}

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/utilisateur`);
  }

  getById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/utilisateur/${id}`);
  }

  create(u: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/utilisateur`, u);
  }

  update(id: string, u: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/utilisateur/${id}`, u);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/utilisateur/${id}`);
  }
}
