import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  currentUser$ = this.authService.currentUser$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
