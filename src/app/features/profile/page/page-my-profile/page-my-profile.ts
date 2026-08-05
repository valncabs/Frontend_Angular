import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { ProfileService } from '../../../profile/data-access/profile';
import { ProfileResponse } from '../../../profile/data-access/profile.models';
import { ProfileFormComponent } from '../../../../shared/components/profile-form/profile-form';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { parseApiError } from '../../../../core/services/api-error';

type ViewState = 'loading' | 'incomplete' | 'view' | 'edit';

@Component({
  selector: 'app-page-my-profile',
  standalone: true,
  imports: [CommonModule, ProfileFormComponent, ConfirmDialogComponent, PetButtonComponent],
  templateUrl: './page-my-profile.html',
})
export class PageMyProfile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  readonly viewState = signal<ViewState>('loading');
  readonly profile = signal<ProfileResponse | null>(null);

  readonly showDeleteDialog = signal(false);
  readonly deletePassword = signal('');
  readonly deleteError = signal<string | null>(null);
  readonly isDeleting = signal(false);

  ngOnInit(): void {
    // Evita un GET innecesario (y su posible 404) cuando ya sabemos por el
    // flag de sesión que el perfil no existe: el modal global obligatorio
    // ya se encarga de ese caso, aquí solo mostramos un estado coherente.
    if (!this.authService.profileCompleted()) {
      this.viewState.set('incomplete');
      return;
    }

    this.loadProfile();
  }

  private loadProfile(): void {
    this.viewState.set('loading');
    this.profileService.getMyProfile().subscribe({
      next: (response) => {
        this.profile.set(response.data);
        this.viewState.set('view');
      },
      error: () => {
        // Estado inconsistente (raro, pero defensivo): el flag decía
        // completo y el backend no encuentra el perfil.
        this.viewState.set('incomplete');
      },
    });
  }

  onProfileCreated(profile: ProfileResponse): void {
    this.authService.markProfileCompleted();
    this.profile.set(profile);
    this.viewState.set('view');
  }

  onProfileUpdated(profile: ProfileResponse): void {
    this.profile.set(profile);
    this.viewState.set('view');
  }

  startEdit(): void {
    this.viewState.set('edit');
  }

  cancelEdit(): void {
    this.viewState.set('view');
  }

  openDeleteDialog(): void {
    this.deletePassword.set('');
    this.deleteError.set(null);
    this.showDeleteDialog.set(true);
  }

  onPasswordInput(event: Event): void {
    this.deletePassword.set((event.target as HTMLInputElement).value);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.deletePassword.set('');
    this.deleteError.set(null);
  }

  confirmDelete(): void {
    if (!this.deletePassword()) {
      this.deleteError.set('Ingresa tu contraseña para confirmar.');
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set(null);

    this.authService.deleteAccount({ password: this.deletePassword() }).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeleteDialog.set(false);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isDeleting.set(false);
        const parsed = parseApiError(error);
        this.deleteError.set(parsed.fieldErrors['password']?.[0] ?? parsed.message);
      },
    });
  }
}
