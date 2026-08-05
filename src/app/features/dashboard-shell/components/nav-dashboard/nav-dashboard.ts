import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { NotificationsBellComponent } from '../../../../core/layout/notifications-bell/notifications-bell';

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

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');

    this.router.navigate(['/home']);
  }

}