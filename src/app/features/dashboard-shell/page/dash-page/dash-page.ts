import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavDashboardComponent } from '../../components/nav-dashboard/nav-dashboard';
import { ProfileCompletionModalComponent } from '../../../../shared/components/profile-completion-modal/profile-completion-modal';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-dash-page',
  standalone: true,
  imports: [NavDashboardComponent, RouterOutlet, ProfileCompletionModalComponent],
  templateUrl: './dash-page.html',
})
export class DashPage implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    // Revalida roles y profile_completed contra el backend UNA vez al
    // montar el shell (no en cada navegación interna del dashboard).
    // Cubre el caso de sesión persistida en localStorage desde otra
    // pestaña/dispositivo donde el flag quedó desactualizado.
    this.authService.refreshMe().subscribe({ error: () => {} });
  }
}
