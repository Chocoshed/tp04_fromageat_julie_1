import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { FavorisStateModel } from './favoris-state.model';
import * as FavorisActions from './favoris.actions';

const FAVORIS_STORAGE_KEY = 'pollution_favoris';

@State<FavorisStateModel>({
  name: 'favoris',
  defaults: {
    favorisIds: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class FavorisState {

  // Sélecteurs
  @Selector()
  static favorisIds(state: FavorisStateModel): string[] {
    return state.favorisIds;
  }

  @Selector()
  static count(state: FavorisStateModel): number {
    return state.favorisIds.length;
  }

  @Selector()
  static isFavoris(state: FavorisStateModel) {
    return (pollutionId: string) => state.favorisIds.includes(pollutionId);
  }

  @Selector()
  static loading(state: FavorisStateModel): boolean {
    return state.loading;
  }

  // Actions
  @Action(FavorisActions.LoadFavoris)
  loadFavoris(ctx: StateContext<FavorisStateModel>) {
    try {
      const storedFavoris = localStorage.getItem(FAVORIS_STORAGE_KEY);
      const favorisIds = storedFavoris ? JSON.parse(storedFavoris) : [];

      ctx.patchState({
        favorisIds,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      ctx.patchState({
        favorisIds: [],
        loading: false,
        error: 'Erreur lors du chargement des favoris'
      });
    }
  }

  @Action(FavorisActions.AddFavoris)
  addFavoris(ctx: StateContext<FavorisStateModel>, action: FavorisActions.AddFavoris) {
    const state = ctx.getState();

    // Vérifier si déjà en favoris
    if (state.favorisIds.includes(action.pollutionId)) {
      return;
    }

    const updatedFavoris = [...state.favorisIds, action.pollutionId];

    // Sauvegarder dans localStorage
    localStorage.setItem(FAVORIS_STORAGE_KEY, JSON.stringify(updatedFavoris));

    ctx.patchState({
      favorisIds: updatedFavoris,
      error: null
    });
  }

  @Action(FavorisActions.RemoveFavoris)
  removeFavoris(ctx: StateContext<FavorisStateModel>, action: FavorisActions.RemoveFavoris) {
    const state = ctx.getState();
    const updatedFavoris = state.favorisIds.filter(id => id !== action.pollutionId);

    // Sauvegarder dans localStorage
    localStorage.setItem(FAVORIS_STORAGE_KEY, JSON.stringify(updatedFavoris));

    ctx.patchState({
      favorisIds: updatedFavoris,
      error: null
    });
  }

  @Action(FavorisActions.ToggleFavoris)
  toggleFavoris(ctx: StateContext<FavorisStateModel>, action: FavorisActions.ToggleFavoris) {
    const state = ctx.getState();
    const isFavoris = state.favorisIds.includes(action.pollutionId);

    if (isFavoris) {
      ctx.dispatch(new FavorisActions.RemoveFavoris(action.pollutionId));
    } else {
      ctx.dispatch(new FavorisActions.AddFavoris(action.pollutionId));
    }
  }

  @Action(FavorisActions.ClearFavoris)
  clearFavoris(ctx: StateContext<FavorisStateModel>) {
    localStorage.removeItem(FAVORIS_STORAGE_KEY);

    ctx.patchState({
      favorisIds: [],
      error: null
    });
  }
}
