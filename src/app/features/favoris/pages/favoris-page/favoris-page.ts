import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PollutionState } from '../../../../core/store/pollution/pollution.state';
import { FavorisState } from '../../../../core/state/favoris/favoris.state';
import { LoadPollutions } from '../../../../core/store/pollution/pollution.actions';
import { Pollution } from '../../../../core/models/pollution.model';
import { PollutionCardComponent } from '../../../pollution/components/pollution-card/pollution-card';

@Component({
  selector: 'app-favoris-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PollutionCardComponent],
  template: `
    <div class="favoris-page">
      <div class="header">
        <h1>Mes pollutions favorites</h1>
        <p class="subtitle">
          {{ (favorisPollutions$ | async)?.length || 0 }} pollution(s) en favoris
        </p>
      </div>

      <div *ngIf="(favorisPollutions$ | async) as pollutions" class="content">
        <div *ngIf="pollutions.length === 0" class="empty-state">
          <div class="empty-icon">⭐</div>
          <h2>Aucun favori pour le moment</h2>
          <p>Ajoutez des pollutions à vos favoris pour les retrouver facilement ici.</p>
          <a routerLink="/pollutions" class="btn-primary">
            Parcourir les pollutions
          </a>
        </div>

        <div *ngIf="pollutions.length > 0" class="pollutions-grid">
          <app-pollution-card
            *ngFor="let pollution of pollutions"
            [pollution]="pollution">
          </app-pollution-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favoris-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.3;
    }

    .empty-state h2 {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 2rem;
    }

    .btn-primary {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #1565c0;
    }

    .pollutions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
  `]
})
export class FavorisPageComponent implements OnInit {
  private store = inject(Store);

  favorisIds$ = this.store.select(FavorisState.favorisIds);
  allPollutions$ = this.store.select(PollutionState.pollutions);

  favorisPollutions$: Observable<Pollution[]> = this.favorisIds$.pipe(
    switchMap(favorisIds =>
      this.allPollutions$.pipe(
        map(pollutions =>
          pollutions.filter(p => p.id && favorisIds.includes(p.id.toString()))
        )
      )
    )
  );

  ngOnInit() {
    // S'assurer que les pollutions sont chargées
    this.store.dispatch(new LoadPollutions());
  }
}
