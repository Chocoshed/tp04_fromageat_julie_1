import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { LoadPollutionById, DeletePollution, ClearSelectedPollution } from '../../../../core/store/pollution/pollution.actions';
import { PollutionState } from '../../../../core/store/pollution/pollution.state';
import { AuthState } from '../../../../core/store/auth/auth.state';
import { Pollution } from '../../../../core/models/pollution.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.css'
})
export class PollutionDetail implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pollution$ = this.store.select(PollutionState.selectedPollution);
  isLoading$ = this.store.select(PollutionState.loading);
  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);

  canEdit$!: Observable<boolean>;
  canDelete$!: Observable<boolean>;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.store.dispatch(new LoadPollutionById(+id));
    }

    // Vérifier les permissions
    const currentUserId = this.store.selectSnapshot(AuthState.user)?.id;

    this.canEdit$ = this.pollution$.pipe(
      map(pollution => {
        if (!pollution || !currentUserId) return false;
        return pollution.utilisateur_id === currentUserId;
      })
    );

    this.canDelete$ = this.pollution$.pipe(
      map(pollution => {
        if (!pollution || !currentUserId) return false;
        return pollution.utilisateur_id === currentUserId;
      })
    );
  }

  onDelete() {
    this.pollution$.subscribe(pollution => {
      if (pollution?.id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
          this.store.dispatch(new DeletePollution(pollution.id)).subscribe(() => {
            this.router.navigate(['/pollutions']);
          });
        }
      }
    }).unsubscribe();
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearSelectedPollution());
  }
}
