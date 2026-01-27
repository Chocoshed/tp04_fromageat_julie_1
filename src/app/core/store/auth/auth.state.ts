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
    token: null,
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

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
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
    // Stocker le token dans localStorage
    localStorage.setItem('auth_token', action.payload.token);

    ctx.patchState({
      user: action.payload.user,
      token: action.payload.token,
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
    // Stocker le token dans localStorage
    localStorage.setItem('auth_token', action.payload.token);

    ctx.patchState({
      user: action.payload.user,
      token: action.payload.token,
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
    // Supprimer le token de localStorage
    localStorage.removeItem('auth_token');

    return this.authService.logout().pipe(
      tap(() => {
        ctx.setState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      }),
      catchError((error) => {
        // Même en cas d'erreur, on déconnecte côté client
        ctx.setState({
          user: null,
          token: null,
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
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      ctx.patchState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      });
      return of(null);
    }

    ctx.patchState({ token, loading: true });

    return this.authService.getCurrentUser().pipe(
      tap((user) => {
        ctx.patchState({
          user,
          isAuthenticated: true,
          loading: false
        });
      }),
      catchError(() => {
        // Token invalide ou expiré
        localStorage.removeItem('auth_token');
        ctx.patchState({
          user: null,
          token: null,
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
