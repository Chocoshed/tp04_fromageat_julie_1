import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../../core/store/auth/auth.actions';
import { AuthState } from '../../../../core/store/auth/auth.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  private store = inject(Store);
  private router = inject(Router);

  error$ = this.store.select(AuthState.error);
  loading$ = this.store.select(AuthState.loading);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(new Login(this.loginForm.value)).subscribe({
      next: () => {
        this.router.navigate(['/pollutions']);
      }
    });
  }

  get login() {
    return this.loginForm.get('login');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
