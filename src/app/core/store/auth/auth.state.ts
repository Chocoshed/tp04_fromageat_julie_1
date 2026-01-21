import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { AuthStateModel } from './auth-state.model';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }
})
@Injectable()
export class AuthState {
  private authService = inject(AuthService);

  // Selectors
  @Selector()
  static user(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return state.isAuthenticated;
  }

  @Selector()
  static loading(state: AuthStateModel) {
    return state.loading;
  }

  @Selector()
  static error(state: AuthStateModel) {
    return state.error;
  }

  // Actions
  @Action(AuthActions.Login)
  login(ctx: StateContext<AuthStateModel>, action: AuthActions.Login) {
    ctx.patchState({ loading: true, error: null });

    return this.authService.login(action.credentials).pipe(
      tap((response) => {
        ctx.dispatch(new AuthActions.LoginSuccess(response));
      }),
      catchError((error) => {
        ctx.dispatch(new AuthActions.LoginFailure(error.error?.message || 'Erreur de connexion'));
        return throwError(() => error);
      })
    );
  }

  @Action(AuthActions.LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: AuthActions.LoginSuccess) {
    ctx.patchState({
      user: action.payload.user,
      isAuthenticated: true,
      loading: false,
      error: null
    });
  }

  @Action(AuthActions.LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: AuthActions.LoginFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action(AuthActions.Register)
  register(ctx: StateContext<AuthStateModel>, action: AuthActions.Register) {
    ctx.patchState({ loading: true, error: null });

    return this.authService.register(action.data).pipe(
      tap((response) => {
        ctx.dispatch(new AuthActions.RegisterSuccess(response));
      }),
      catchError((error) => {
        ctx.dispatch(new AuthActions.RegisterFailure(error.error?.message || 'Erreur d\'inscription'));
        return throwError(() => error);
      })
    );
  }

  @Action(AuthActions.RegisterSuccess)
  registerSuccess(ctx: StateContext<AuthStateModel>, action: AuthActions.RegisterSuccess) {
    ctx.patchState({
      user: action.payload.user,
      isAuthenticated: true,
      loading: false,
      error: null
    });
  }

  @Action(AuthActions.RegisterFailure)
  registerFailure(ctx: StateContext<AuthStateModel>, action: AuthActions.RegisterFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    return this.authService.logout().pipe(
      tap(() => {
        ctx.setState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      }),
      catchError((error) => {
        // Même en cas d'erreur, on déconnecte côté client
        ctx.setState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        return of(null);
      })
    );
  }

  @Action(AuthActions.InitAuth)
  initAuth(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ loading: true });
    return this.authService.getCurrentUser().pipe(
      tap((user) => {
        ctx.patchState({
          user,
          isAuthenticated: true,
          loading: false
        });
      }),
      catchError(() => {
        // Si l'appel échoue, l'utilisateur n'est pas authentifié
        ctx.patchState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
        return of(null);
      })
    );
  }

  @Action(AuthActions.GetCurrentUser)
  getCurrentUser(ctx: StateContext<AuthStateModel>) {
    return this.authService.getCurrentUser().pipe(
      tap((user) => {
        ctx.patchState({ user });
      })
    );
  }
}
