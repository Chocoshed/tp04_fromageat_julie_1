import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Logout } from '../../../core/store/auth/auth.actions';
import { AuthState } from '../../../core/store/auth/auth.state';
import { FavorisState } from '../../../core/state/favoris/favoris.state';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  private store = inject(Store);
  private router = inject(Router);

  currentUser$ = this.store.select(AuthState.user);
  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  favorisCount$ = this.store.select(FavorisState.count);

  logout(): void {
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }
}
