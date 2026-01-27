import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Pollution } from '../../../../core/models/pollution.model';
import { FavorisState } from '../../../../core/state/favoris/favoris.state';
import { ToggleFavoris } from '../../../../core/state/favoris/favoris.actions';

@Component({
  selector: 'app-pollution-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pollution-card">
      <div class="card-header">
        <h3>{{ pollution.titre }}</h3>
        <button
          class="btn-favoris"
          [class.favoris-active]="isFavoris()"
          (click)="onToggleFavoris($event)"
          title="{{ isFavoris() ? 'Retirer des favoris' : 'Ajouter aux favoris' }}">
          {{ isFavoris() ? '★' : '☆' }}
        </button>
      </div>

      <div class="card-body">
        <p class="type-badge">{{ pollution.type_pollution }}</p>
        <p class="lieu">📍 {{ pollution.lieu }}</p>
        <p class="date">📅 {{ pollution.date_observation | date:'dd/MM/yyyy' }}</p>
        <p class="description">{{ pollution.description }}</p>
      </div>

      <div class="card-footer">
        <a [routerLink]="['/pollutions', pollution.id]" class="btn-details">
          Voir détails
        </a>
      </div>
    </div>
  `,
  styleUrl: './pollution-card.css'
})
export class PollutionCardComponent {
  @Input({ required: true }) pollution!: Pollution;

  private store = inject(Store);

  isFavoris(): boolean {
    if (!this.pollution?.id) return false;
    return this.store.selectSnapshot(FavorisState.isFavoris)(this.pollution.id.toString());
  }

  onToggleFavoris(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.pollution?.id) return;
    this.store.dispatch(new ToggleFavoris(this.pollution.id.toString()));
  }
}
