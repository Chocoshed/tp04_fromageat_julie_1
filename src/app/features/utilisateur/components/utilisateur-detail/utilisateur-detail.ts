import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { Utilisateur } from '../../../../core/models/utilisateur.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-utilisateur-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './utilisateur-detail.html',
  styleUrl: './utilisateur-detail.css'
})
export class UtilisateurDetail implements OnInit {
  service = inject(UtilisateurService);
  route = inject(ActivatedRoute);
  utilisateur?: Utilisateur;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getById(id).subscribe((utilisateur) => {
        this.utilisateur = utilisateur;
      });
    }
  }
}
