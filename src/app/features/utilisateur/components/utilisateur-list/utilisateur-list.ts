import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-utilisateur-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './utilisateur-list.html',
  styleUrl: './utilisateur-list.css'
})
export class UtilisateurList {
  service = inject(UtilisateurService);
  utilisateurs$ = this.service.getAll();

  onDelete(id: string | undefined) {
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.service.delete(id).subscribe({
        next: () => {
          console.log('Utilisateur supprimé avec succès');
          // Recharger la liste
          this.utilisateurs$ = this.service.getAll();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de l\'utilisateur');
        }
      });
    }
  }
}
