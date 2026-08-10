import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { NotificationsBellComponent } from '../../../../core/layout/notifications-bell/notifications-bell';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-nav-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LucideAngularModule,
    NotificationsBellComponent,
  ],
  templateUrl: './nav-dashboard.html',
})
export class NavDashboardComponent {

  isMenuOpen = false;

  private readonly authService = inject(AuthService);

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}