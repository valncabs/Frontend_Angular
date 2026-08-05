import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-configuration.html',
})
export class PageConfiguration {

  constructor(private router: Router) {}

  // Estados locales para los interruptores
  notificationsEnabled = true;
  emailReportsEnabled = false;
  securityAlertsEnabled = true;

  // Alternar los interruptores
  toggleSetting(setting: 'notifications' | 'email' | 'alerts'): void {

    if (setting === 'notifications') {
      this.notificationsEnabled = !this.notificationsEnabled;
    }

    if (setting === 'email') {
      this.emailReportsEnabled = !this.emailReportsEnabled;
    }

    if (setting === 'alerts') {
      this.securityAlertsEnabled = !this.securityAlertsEnabled;
    }

  }

  // Cerrar sesión
  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');

    this.router.navigate(['/home']);

  }

}