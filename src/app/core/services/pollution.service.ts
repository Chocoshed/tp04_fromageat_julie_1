import { Injectable, Inject } from '@angular/core';
import { Pollution } from '../models/pollution.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) {}

  getAll(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(`${this.apiUrl}/pollution`, {
      withCredentials: true
    });
  }

  getById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/pollution/${id}`, {
      withCredentials: true
    });
  }

  create(p: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(`${this.apiUrl}/pollution`, p, {
      withCredentials: true
    });
  }

  update(id: number, p: Pollution): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/pollution/${id}`, p, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pollution/${id}`, {
      withCredentials: true
    });
  }
}
