import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { AuthCard } from '../../../auth/components/auth-card/auth-card';
import { EmailInputComponent } from '../../../auth/components/email-input/email-input';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent, AuthCard, EmailInputComponent],
  templateUrl: './forgot-password-page.html',
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly sent = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService.forgotPassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.sent.set(true);
      },
      error: () => {
        // El backend no revela si el correo existe: mismo resultado siempre.
        this.isSubmitting.set(false);
        this.sent.set(true);
      },
    });
  }

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.touched && control.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.touched && control.hasError('email')) return 'Correo inválido.';
    return null;
  }
}