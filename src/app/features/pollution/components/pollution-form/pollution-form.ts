import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Pollution } from '../../../../core/models/pollution.model';
import { PollutionService } from '../../../../core/services/pollution.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css'
})
export class PollutionForm {
  @Output() pollutionSubmitted = new EventEmitter<Pollution>();
  pollutionForm: FormGroup;
  service = inject(PollutionService);
  rooter = inject(Router);

  pollutionTypes = [
    'Plastique',
    'Chimique',
    'Dépôt sauvage',
    'Eau',
    'Air',
    'Autre'
  ];

  constructor(private fb: FormBuilder) {
    this.pollutionForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      type_pollution: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date_observation: ['', [Validators.required, this.dateValidator]],
      lieu: ['', [Validators.required, Validators.minLength(3)]],
      latitude: [
        '',
        [Validators.required, Validators.min(-90), Validators.max(90), this.numberValidator]
      ],
      longitude: [
        '',
        [Validators.required, Validators.min(-180), Validators.max(180), this.numberValidator]
      ],
      photo_url: ['', [Validators.pattern('https?://.+')]]
    });
  }

  // Validateur personnalisé pour vérifier que c'est un nombre valide
  numberValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Laisse le Validators.required gérer le cas vide
    }
    const value = control.value;
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);
    return isNumber ? null : { invalidNumber: true };
  }

  // Validateur personnalisé pour la date
  dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Laisse le Validators.required gérer le cas vide
    }

    const dateValue = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fin de la journée

    // Vérifier que la date est valide
    if (isNaN(dateValue.getTime())) {
      return { invalidDate: true };
    }

    // Vérifier que la date n'est pas dans le futur
    if (dateValue > today) {
      return { futureDate: true };
    }

    // Vérifier que la date n'est pas trop ancienne (exemple: pas plus de 10 ans)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    if (dateValue < tenYearsAgo) {
      return { tooOldDate: true };
    }

    return null;
  }

  onSubmit() {
    if (this.pollutionForm.valid) {
      const pollution = this.pollutionForm.value as Pollution;
      this.service.create(pollution);
      this.service.getAll();
      this.pollutionForm.reset();
      this.rooter.navigate(['pollutions']);
    } else {
      this.pollutionForm.markAllAsTouched();
    }
  }
}
