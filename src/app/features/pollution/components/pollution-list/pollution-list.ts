import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPollutions, DeletePollution } from '../../../../core/store/pollution/pollution.actions';
import { PollutionState } from '../../../../core/store/pollution/pollution.state';
import { AuthState } from '../../../../core/store/auth/auth.state';
import { AsyncPipe } from '@angular/common';
import { PollutionCardComponent } from '../pollution-card/pollution-card';
import { PollutionService } from '../../../../core/services/pollution.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, startWith } from 'rxjs/operators';
import { Pollution } from '../../../../core/models/pollution.model';

@Component({
  selector: 'app-pollution-list',
  imports: [AsyncPipe, RouterLink, PollutionCardComponent],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})
export class PollutionList implements OnInit, AfterViewInit {
  private store = inject(Store);
  private pollutionService = inject(PollutionService);

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  pollutions$!: Observable<Pollution[]>;
  loading$ = this.store.select(PollutionState.loading);
  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  currentUserId?: string;

  ngOnInit() {
    this.currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
  }

  ngAfterViewInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    // FLUX RXJS OBLIGATOIRE : recherche dynamique avec debounceTime, distinctUntilChanged et switchMap
    this.pollutions$ = fromEvent<Event>(
      this.searchInput.nativeElement,
      'input'
    ).pipe(
      // 1. Extraire la valeur de l'input
      map((event: Event) => (event.target as HTMLInputElement).value),

      // 2. Nettoyer la valeur (trim)
      map(value => value.trim()),

      // 3. DEBOUNCE : attendre 300ms de "calme" avant d'émettre
      debounceTime(300),

      // 4. DISTINCT : ignorer les valeurs identiques consécutives
      distinctUntilChanged(),

      // 5. SWITCHMAP : annuler la requête précédente si nouvelle valeur
      switchMap(query => {
        if (query === '') {
          // Si vide, charger toutes les pollutions
          return this.pollutionService.getAll();
        }
        // Sinon, recherche via API
        return this.pollutionService.searchPollutions(query);
      }),

      // 6. Valeur initiale : toutes les pollutions au chargement
      startWith([])
    );

    // Chargement initial des pollutions via un événement input avec valeur vide
    setTimeout(() => {
      const event = new Event('input', { bubbles: true });
      this.searchInput.nativeElement.dispatchEvent(event);
    }, 0);
  }

  canEdit(pollutionUserId?: string): boolean {
    return !!this.currentUserId && this.currentUserId === pollutionUserId;
  }

  onDelete(id: number | undefined) {
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.store.dispatch(new DeletePollution(id));
    }
  }
}
