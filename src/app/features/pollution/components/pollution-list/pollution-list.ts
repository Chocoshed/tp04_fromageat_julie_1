import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PollutionService } from '../../../../core/services/pollution.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pollution-list',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})
export class PollutionList {
  service = inject(PollutionService);
  pollutions$ = this.service.getAll();

  onDelete(id: number | undefined) {
    if (!id) return;

    // Demander confirmation avant de supprimer
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.service.delete(id).subscribe({
        next: () => {
          console.log('Pollution supprimée avec succès');
          // Rafraîchir la liste des pollutions après suppression
          this.pollutions$ = this.service.getAll();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de la pollution');
        }
      });
    }
  }
}
