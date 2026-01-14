import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPollutions, DeletePollution } from '../../../../core/store/pollution/pollution.actions';
import { PollutionState } from '../../../../core/store/pollution/pollution.state';
import { AuthState } from '../../../../core/store/auth/auth.state';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pollution-list',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})
export class PollutionList implements OnInit {
  private store = inject(Store);

  pollutions$ = this.store.select(PollutionState.pollutions);
  loading$ = this.store.select(PollutionState.loading);
  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);

  ngOnInit() {
    this.store.dispatch(new LoadPollutions());
  }

  onDelete(id: number | undefined) {
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.store.dispatch(new DeletePollution(id));
    }
  }
}
