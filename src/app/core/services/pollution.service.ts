import { Injectable, Inject } from '@angular/core';
import { Pollution } from '../models/pollution.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private _pollutions = new BehaviorSubject<Pollution[]>([]);
  pollutions$ = this._pollutions.asObservable();

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) {}

  getAll(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(`${this.apiUrl}/pollution`);
  }

  getById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/pollution/${id}`);
  }

  create(p: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(`${this.apiUrl}/pollution`, p);
  }

  update(id: number, p: Pollution): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/pollution/${id}`, p);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pollution/${id}`);
  }
}
