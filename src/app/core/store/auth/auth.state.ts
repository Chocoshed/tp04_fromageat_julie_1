import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthStateModel } from './auth-state.model';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

const TOKEN_KEY = 'auth_token';

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
  static token(state: AuthStateModel) {
    return state.token;
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
    localStorage.setItem(TOKEN_KEY, action.payload.token);
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
    localStorage.setItem(TOKEN_KEY, action.payload.token);
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
    localStorage.removeItem(TOKEN_KEY);
    ctx.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  }

  @Action(AuthActions.CheckAuthStatus)
  checkAuthStatus(ctx: StateContext<AuthStateModel>) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
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
          ctx.dispatch(new AuthActions.Logout());
          return throwError(() => new Error('Token invalide'));
        })
      );
    }
    return;
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
