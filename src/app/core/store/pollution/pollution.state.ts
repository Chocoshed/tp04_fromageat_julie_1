import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PollutionStateModel } from './pollution-state.model';
import { PollutionService } from '../../services/pollution.service';
import * as PollutionActions from './pollution.actions';

@State<PollutionStateModel>({
  name: 'pollution',
  defaults: {
    pollutions: [],
    selectedPollution: null,
    loading: false,
    error: null
  }
})
@Injectable()
export class PollutionState {
  private pollutionService = inject(PollutionService);

  // Selectors
  @Selector()
  static pollutions(state: PollutionStateModel) {
    return state.pollutions;
  }

  @Selector()
  static selectedPollution(state: PollutionStateModel) {
    return state.selectedPollution;
  }

  @Selector()
  static loading(state: PollutionStateModel) {
    return state.loading;
  }

  @Selector()
  static error(state: PollutionStateModel) {
    return state.error;
  }

  // Actions
  @Action(PollutionActions.LoadPollutions)
  loadPollutions(ctx: StateContext<PollutionStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.pollutionService.getAll().pipe(
      tap((pollutions) => {
        ctx.dispatch(new PollutionActions.LoadPollutionsSuccess(pollutions));
      }),
      catchError((error) => {
        ctx.dispatch(new PollutionActions.LoadPollutionsFailure(error.message));
        return throwError(() => error);
      })
    );
  }

  @Action(PollutionActions.LoadPollutionsSuccess)
  loadPollutionsSuccess(ctx: StateContext<PollutionStateModel>, action: PollutionActions.LoadPollutionsSuccess) {
    ctx.patchState({
      pollutions: action.pollutions,
      loading: false,
      error: null
    });
  }

  @Action(PollutionActions.LoadPollutionsFailure)
  loadPollutionsFailure(ctx: StateContext<PollutionStateModel>, action: PollutionActions.LoadPollutionsFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action(PollutionActions.LoadPollutionById)
  loadPollutionById(ctx: StateContext<PollutionStateModel>, action: PollutionActions.LoadPollutionById) {
    ctx.patchState({ loading: true, error: null });

    return this.pollutionService.getById(action.id).pipe(
      tap((pollution) => {
        ctx.dispatch(new PollutionActions.LoadPollutionByIdSuccess(pollution));
      }),
      catchError((error) => {
        ctx.patchState({ loading: false, error: error.message });
        return throwError(() => error);
      })
    );
  }

  @Action(PollutionActions.LoadPollutionByIdSuccess)
  loadPollutionByIdSuccess(ctx: StateContext<PollutionStateModel>, action: PollutionActions.LoadPollutionByIdSuccess) {
    ctx.patchState({
      selectedPollution: action.pollution,
      loading: false,
      error: null
    });
  }

  @Action(PollutionActions.CreatePollution)
  createPollution(ctx: StateContext<PollutionStateModel>, action: PollutionActions.CreatePollution) {
    ctx.patchState({ loading: true, error: null });

    return this.pollutionService.create(action.pollution).pipe(
      tap((pollution) => {
        ctx.dispatch(new PollutionActions.CreatePollutionSuccess(pollution));
      }),
      catchError((error) => {
        ctx.patchState({ loading: false, error: error.message });
        return throwError(() => error);
      })
    );
  }

  @Action(PollutionActions.CreatePollutionSuccess)
  createPollutionSuccess(ctx: StateContext<PollutionStateModel>, action: PollutionActions.CreatePollutionSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      pollutions: [...state.pollutions, action.pollution],
      loading: false,
      error: null
    });
  }

  @Action(PollutionActions.UpdatePollution)
  updatePollution(ctx: StateContext<PollutionStateModel>, action: PollutionActions.UpdatePollution) {
    ctx.patchState({ loading: true, error: null });

    return this.pollutionService.update(action.id, action.pollution).pipe(
      tap((pollution) => {
        ctx.dispatch(new PollutionActions.UpdatePollutionSuccess(pollution));
      }),
      catchError((error) => {
        ctx.patchState({ loading: false, error: error.message });
        return throwError(() => error);
      })
    );
  }

  @Action(PollutionActions.UpdatePollutionSuccess)
  updatePollutionSuccess(ctx: StateContext<PollutionStateModel>, action: PollutionActions.UpdatePollutionSuccess) {
    const state = ctx.getState();
    const updatedPollutions = state.pollutions.map(p =>
      p.id === action.pollution.id ? action.pollution : p
    );

    ctx.patchState({
      pollutions: updatedPollutions,
      selectedPollution: action.pollution,
      loading: false,
      error: null
    });
  }

  @Action(PollutionActions.DeletePollution)
  deletePollution(ctx: StateContext<PollutionStateModel>, action: PollutionActions.DeletePollution) {
    ctx.patchState({ loading: true, error: null });

    return this.pollutionService.delete(action.id).pipe(
      tap(() => {
        ctx.dispatch(new PollutionActions.DeletePollutionSuccess(action.id));
      }),
      catchError((error) => {
        ctx.patchState({ loading: false, error: error.message });
        return throwError(() => error);
      })
    );
  }

  @Action(PollutionActions.DeletePollutionSuccess)
  deletePollutionSuccess(ctx: StateContext<PollutionStateModel>, action: PollutionActions.DeletePollutionSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      pollutions: state.pollutions.filter(p => p.id !== action.id),
      loading: false,
      error: null
    });
  }

  @Action(PollutionActions.ClearSelectedPollution)
  clearSelectedPollution(ctx: StateContext<PollutionStateModel>) {
    ctx.patchState({ selectedPollution: null });
  }
}
