import { LoginCredentials, RegisterData } from '../../models/auth.model';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public credentials: LoginCredentials) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: { user: any; token: string }) {}
}

export class LoginFailure {
  static readonly type = '[Auth] Login Failure';
  constructor(public error: string) {}
}

export class Register {
  static readonly type = '[Auth] Register';
  constructor(public data: RegisterData) {}
}

export class RegisterSuccess {
  static readonly type = '[Auth] Register Success';
  constructor(public payload: { user: any; token: string }) {}
}

export class RegisterFailure {
  static readonly type = '[Auth] Register Failure';
  constructor(public error: string) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class CheckAuthStatus {
  static readonly type = '[Auth] Check Auth Status';
}

export class GetCurrentUser {
  static readonly type = '[Auth] Get Current User';
}
