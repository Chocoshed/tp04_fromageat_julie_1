import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPollutions, DeletePollution } from '../../../../core/store/pollution/pollution.actions';
import { PollutionState } from '../../../../core/store/pollution/pollution.state';
import { AuthState } from '../../../../core/store/auth/auth.state';
import { AsyncPipe } from '@angular/common';
import { PollutionCardComponent } from '../pollution-card/pollution-card';

@Component({
  selector: 'app-pollution-list',
  imports: [AsyncPipe, RouterLink, PollutionCardComponent],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})
export class PollutionList implements OnInit {
  private store = inject(Store);

  pollutions$ = this.store.select(PollutionState.pollutions);
  loading$ = this.store.select(PollutionState.loading);
  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  currentUserId?: string;

  ngOnInit() {
    this.store.dispatch(new LoadPollutions());
    this.currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
  }

  canEdit(pollutionUserId?: string): boolean {
    return !!this.currentUserId && this.currentUserId === pollutionUserId;
  }

  onDelete(id: number | undefined) {
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.store.dispatch(new DeletePollution(id));
    }
  }
}
