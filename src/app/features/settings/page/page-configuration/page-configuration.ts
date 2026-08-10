import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-page-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-configuration.html',
})
export class PageConfiguration {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

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
    // Delegar en AuthService: limpia TODAS las claves de sesión, notifica el
    // logout al backend, resetea el signal currentUser y el timer de refresco.
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}