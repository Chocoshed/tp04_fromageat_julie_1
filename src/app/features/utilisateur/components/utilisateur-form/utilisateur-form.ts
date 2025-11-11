import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Utilisateur } from '../../../../core/models/utilisateur.model';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-utilisateur-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './utilisateur-form.html',
  styleUrl: './utilisateur-form.css'
})
export class UtilisateurForm implements OnInit {
  utilisateurForm: FormGroup;
  service = inject(UtilisateurService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditMode = false;
  utilisateurId?: string;

  constructor(private fb: FormBuilder) {
    this.utilisateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: [''],
      login: ['', [Validators.required, Validators.minLength(3)]],
      pass: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.utilisateurId = id;

      this.service.getById(this.utilisateurId).subscribe((utilisateur) => {
        if (utilisateur) {
          this.utilisateurForm.patchValue({
            nom: utilisateur.nom,
            prenom: utilisateur.prenom || '',
            login: utilisateur.login,
            pass: ''
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.utilisateurForm.valid) {
      const utilisateur = this.utilisateurForm.value as Utilisateur;

      if (this.isEditMode && this.utilisateurId) {
        this.service.update(this.utilisateurId, utilisateur).subscribe({
          next: () => {
            alert('Utilisateur modifié avec succès');
            this.router.navigate(['/utilisateurs']);
          },
          error: (err) => {
            console.error('Erreur lors de la modification:', err);
            alert('Erreur lors de la modification de l\'utilisateur');
          }
        });
      } else {
        // Mode création - l'API générera l'ID automatiquement
        this.service.create(utilisateur).subscribe({
          next: () => {
            alert('Utilisateur créé avec succès');
            this.router.navigate(['/utilisateurs']);
          },
          error: (err) => {
            console.error('Erreur lors de la création:', err);
            alert('Erreur lors de la création de l\'utilisateur');
          }
        });
      }
    } else {
      this.utilisateurForm.markAllAsTouched();
    }
  }
}
