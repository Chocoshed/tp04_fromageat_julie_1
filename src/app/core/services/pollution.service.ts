import { Injectable } from '@angular/core';
import { Pollution } from '../models/pollution.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private _pollutions = new BehaviorSubject<Pollution[]>([]);
  pollutions$ = this._pollutions.asObservable();

  private data: Pollution[] = [
    {
      id: 1,
      titre: 'Pollution plastique plage',
      type_pollution: 'Plastique',
      description: 'Nombreux déchets retrouvés sur la plage',
      date_observation: new Date(),
      lieu: 'Nice',
      latitude: 43.7,
      longitude: 7.26,
      photo_url: ''
    }
  ];

  constructor() {
    this._pollutions.next(this.data);
  }

  getAll(): Observable<Pollution[]> {
    return this.pollutions$;
  }

  getById(id: number): Observable<Pollution | undefined> {
    return of(this.data.find(p => p.id === id));
  }

  create(p: Pollution): Observable<Pollution> {
    const newPollution = { ...p, id: Date.now() };
    this.data.push(newPollution);
    this._pollutions.next(this.data);
    return of(newPollution);
  }

  update(id: number, p: Pollution): Observable<Pollution> {
    const index = this.data.findIndex(x => x.id === id);
    if (index !== -1) {
      this.data[index] = { ...p, id };
      this._pollutions.next(this.data);
      return of(this.data[index]);
    }
    throw new Error('Pollution non trouvée');
  }

  delete(id: number): Observable<void> {
    this.data = this.data.filter(p => p.id !== id);
    this._pollutions.next(this.data);
    return of(void 0);
  }
}
