import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular'; // 👈 Inyección de Auth0

@Component({
  selector: 'app-page-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-configuration.html',
})
export class PageConfiguration {
  private auth = inject(AuthService);

  // Estados locales para los interruptores (Switches)
  notificationsEnabled = true;
  emailReportsEnabled = false;
  securityAlertsEnabled = true;

  // Alternar los interruptores de manera reactiva
  toggleSetting(setting: 'notifications' | 'email' | 'alerts') {
    if (setting === 'notifications') this.notificationsEnabled = !this.notificationsEnabled;
    if (setting === 'email') this.emailReportsEnabled = !this.emailReportsEnabled;
    if (setting === 'alerts') this.securityAlertsEnabled = !this.securityAlertsEnabled;
  }

  // Método para cerrar sesión de forma segura a través de Auth0
  logout() {
    this.auth.logout({ 
      logoutParams: { returnTo: window.location.origin } 
    });
  }
}
