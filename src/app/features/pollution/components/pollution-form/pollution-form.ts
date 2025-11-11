import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Pollution } from '../../../../core/models/pollution.model';
import { PollutionService } from '../../../../core/services/pollution.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { PollutionRecap } from '../pollution-recap/pollution-recap';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PollutionRecap],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm implements OnInit {
  @Output() pollutionSubmitted = new EventEmitter<Pollution>();
  pollutionForm: FormGroup;
  service = inject(PollutionService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditMode = false;
  pollutionId?: number;
  showRecap = false;
  submittedPollution?: Pollution;

  pollutionTypes = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  constructor(private fb: FormBuilder) {
    this.pollutionForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      type_pollution: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date_observation: ['', [Validators.required, this.dateValidator]],
      lieu: ['', [Validators.required, Validators.minLength(3)]],
      latitude: [
        '',
        [Validators.required, Validators.min(-90), Validators.max(90), this.numberValidator],
      ],
      longitude: [
        '',
        [Validators.required, Validators.min(-180), Validators.max(180), this.numberValidator],
      ],
      photo_url: ['', [Validators.pattern('https?://.+')]],
    });
  }

  ngOnInit() {
    // Récupérer l'ID depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.pollutionId = +id; // Convertir en nombre

      // Charger les données de la pollution
      this.service.getById(this.pollutionId).subscribe((pollution) => {
        if (pollution) {
          // Formater la date pour l'input type="date"
          let dateValue = '';
          if (pollution.date_observation) {
            const date = new Date(pollution.date_observation);
            dateValue = date.toISOString().split('T')[0];
          }

          // Remplir le formulaire avec les données existantes
          this.pollutionForm.patchValue({
            titre: pollution.titre,
            type_pollution: pollution.type_pollution,
            description: pollution.description,
            date_observation: dateValue,
            lieu: pollution.lieu,
            latitude: pollution.latitude,
            longitude: pollution.longitude,
            photo_url: pollution.photo_url || '',
          });
        }
      });
    }
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

      if (this.isEditMode && this.pollutionId) {
        // Mode édition
        this.service.update(this.pollutionId, pollution).subscribe((createdPollution) => {
          this.submittedPollution = createdPollution;
          this.showRecap = true;
        });
      } else {
        // Mode création
        this.service.create(pollution).subscribe((createdPollution) => {
          this.submittedPollution = createdPollution;
          this.showRecap = true;
        });
      }
    } else {
      this.pollutionForm.markAllAsTouched();
    }
  }

  onNewDeclaration() {
    // Réinitialiser pour afficher à nouveau le formulaire
    this.showRecap = false;
    this.submittedPollution = undefined;
    this.pollutionForm.reset();
  }

  onViewList() {
    // Naviguer vers la liste
    this.router.navigate(['/pollutions']);
  }
}
