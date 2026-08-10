import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { NotificationsBellComponent } from '../../../../core/layout/notifications-bell/notifications-bell';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NotificationsBellComponent],
  templateUrl: './admin-nav.html',
})
export class AdminNavComponent {

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