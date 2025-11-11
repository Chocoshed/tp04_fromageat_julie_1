import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../../../../core/services/pollution.service';
import { Pollution } from '../../../../core/models/pollution.model';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.css'
})
export class PollutionDetail implements OnInit {
  service = inject(PollutionService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  pollution?: Pollution;
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.service.getById(+id).subscribe({
        next: (pollution) => {
          this.pollution = pollution;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement:', err);
          this.isLoading = false;
          alert('Pollution non trouvée');
          this.router.navigate(['/pollutions']);
        }
      });
    }
  }

  onDelete() {
    if (!this.pollution?.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.service.delete(this.pollution.id).subscribe({
        next: () => {
          this.router.navigate(['/pollutions']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
}
