import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string = '';
  isLoading: boolean = false;

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

    this.isLoading = true;
    this.errorMessage = '';

    // Extraire les données sans confirmPass
    const { confirmPass, ...registerData } = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: () => {
        // Rediriger vers la page des pollutions après inscription réussie
        this.router.navigate(['/pollutions']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error('Erreur d\'inscription:', err);
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
