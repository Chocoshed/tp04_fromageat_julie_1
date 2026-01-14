import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Register } from '../../../../core/store/auth/auth.actions';
import { AuthState } from '../../../../core/store/auth/auth.state';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  private store = inject(Store);
  private router = inject(Router);

  error$ = this.store.select(AuthState.error);
  loading$ = this.store.select(AuthState.loading);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: [''],
      login: ['', [Validators.required, Validators.minLength(3)]],
      pass: ['', [Validators.required, Validators.minLength(4)]],
      confirmPass: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validator personnalisé pour vérifier que les mots de passe correspondent
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('pass');
    const confirmPass = control.get('confirmPass');

    if (!pass || !confirmPass) {
      return null;
    }

    return pass.value === confirmPass.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    // Extraire les données sans confirmPass
    const { confirmPass, ...registerData } = this.registerForm.value;

    this.store.dispatch(new Register(registerData)).subscribe({
      next: () => {
        this.router.navigate(['/pollutions']);
      }
    });
  }

  get nom() {
    return this.registerForm.get('nom');
  }

  get prenom() {
    return this.registerForm.get('prenom');
  }

  get login() {
    return this.registerForm.get('login');
  }

  get pass() {
    return this.registerForm.get('pass');
  }

  get confirmPass() {
    return this.registerForm.get('confirmPass');
  }

  get passwordMismatch() {
    return this.registerForm.errors?.['passwordMismatch'] &&
           this.confirmPass?.touched;
  }
}
