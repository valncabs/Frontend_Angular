import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { ProfileResponse } from '../../../features/profile/data-access/profile.models';
import { ModalComponent } from '../modal/modal';
import { ProfileFormComponent } from '../profile-form/profile-form';

@Component({
  selector: 'app-profile-completion-modal',
  standalone: true,
  imports: [ModalComponent, ProfileFormComponent],
  template: `
    <app-modal
      [isOpen]="!authService.profileCompleted()"
      title="Completa tu perfil"
      size="lg"
      [dismissible]="false"
    >
      <p class="text-sm text-[var(--text-secondary)] mb-4">
        Necesitamos algunos datos tuyos antes de que puedas reportar o buscar mascotas.
      </p>
      <app-profile-form mode="create" (saved)="onSaved()" />
    </app-modal>
  `,
})
export class ProfileCompletionModalComponent {
  readonly authService = inject(AuthService);

  onSaved(): void {
    this.authService.markProfileCompleted();
  }
}
