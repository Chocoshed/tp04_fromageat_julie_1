import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPollutions, DeletePollution } from '../../../../core/store/pollution/pollution.actions';
import { PollutionState } from '../../../../core/store/pollution/pollution.state';
import { AuthState } from '../../../../core/store/auth/auth.state';
import { FavorisState } from '../../../../core/state/favoris/favoris.state';
import { AsyncPipe } from '@angular/common';
import { PollutionCardComponent } from '../pollution-card/pollution-card';
import { PollutionFiltersComponent, PollutionFilters } from '../pollution-filters/pollution-filters';
import { PollutionService } from '../../../../core/services/pollution.service';
import { fromEvent, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, startWith } from 'rxjs/operators';
import { Pollution } from '../../../../core/models/pollution.model';

@Component({
  selector: 'app-pollution-list',
  imports: [AsyncPipe, RouterLink, PollutionCardComponent, PollutionFiltersComponent],
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

  private filters$ = new BehaviorSubject<PollutionFilters>({
    types: ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'],
    statut: 'toutes'
  });

  ngOnInit() {
    this.currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
  }

  ngAfterViewInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    // Observable de recherche textuelle avec RxJS
    const searchResults$ = fromEvent<Event>(
      this.searchInput.nativeElement,
      'input'
    ).pipe(
      map((event: Event) => (event.target as HTMLInputElement).value),
      map(value => value.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      startWith('')
    );

    // Récupérer les données nécessaires depuis le store
    const pollutionsState$ = this.store.select(PollutionState.pollutions);
    const favorisIds$ = this.store.select(FavorisState.favorisIds);
    const userId$ = this.store.select(AuthState.user).pipe(
      map(user => user?.id)
    );

    // Combiner toutes les sources de données avec les filtres
    this.pollutions$ = combineLatest([
      pollutionsState$,
      searchResults$,
      this.filters$,
      favorisIds$,
      userId$
    ]).pipe(
      switchMap(async ([allPollutions, searchTerm, filters, favorisIds, userId]) => {
        // Si recherche active, faire l'appel API
        let basePollutions: Pollution[];
        if (searchTerm !== '') {
          basePollutions = await this.pollutionService.searchPollutions(searchTerm).toPromise() || [];
        } else {
          // Charger toutes les pollutions si pas de recherche
          if (allPollutions.length === 0) {
            basePollutions = await this.pollutionService.getAll().toPromise() || [];
          } else {
            basePollutions = allPollutions;
          }
        }

        // Appliquer les filtres sur les résultats
        return this.applyFilters(basePollutions, filters, favorisIds.map(id => Number(id)), userId);
      })
    );

    // Chargement initial
    this.store.dispatch(new LoadPollutions());
  }

  onFiltersChange(filters: PollutionFilters) {
    this.filters$.next(filters);
  }

  private applyFilters(
    pollutions: Pollution[],
    filters: PollutionFilters,
    favorisIds: number[],
    userId?: string
  ): Pollution[] {
    return pollutions.filter(p => {
      // Filtre par statut
      if (filters.statut === 'miennes' && p.utilisateur_id !== userId) {
        return false;
      }
      if (filters.statut === 'favoris' && !favorisIds.includes(p.id!)) {
        return false;
      }

      // Filtre par type
      if (filters.types.length > 0 && !filters.types.includes(p.type_pollution)) {
        return false;
      }

      // Filtre par période
      if (filters.dateDebut) {
        const dateDebut = new Date(filters.dateDebut);
        const dateObservation = new Date(p.date_observation);
        if (dateObservation < dateDebut) {
          return false;
        }
      }
      if (filters.dateFin) {
        const dateFin = new Date(filters.dateFin);
        const dateObservation = new Date(p.date_observation);
        if (dateObservation > dateFin) {
          return false;
        }
      }

      return true;
    });
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
