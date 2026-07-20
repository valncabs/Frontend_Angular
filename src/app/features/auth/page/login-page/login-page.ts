import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { EmailInputComponent } from '../../../auth/components/email-input/email-input';
import { PasswordInputComponent } from '../../../auth/components/password-input/password-input';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { AuthService } from '../../../../core/services/auth';
import { parseApiError } from '../../../../core/services/api-error';

const UNVERIFIED_EMAIL_MESSAGE = 'Debes verificar tu correo antes de iniciar sesión.';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthLayoutComponent,
    EmailInputComponent,
    PasswordInputComponent,
    ModalComponent,
  ],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showForgotPassword = false;
  showResendVerification = false;

  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});
  readonly showResendLink = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly forgotForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly isSendingForgot = signal(false);
  readonly forgotMessage = signal<string | null>(null);

  readonly resendForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly isSendingResend = signal(false);
  readonly resendMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.generalError.set(null);
    this.fieldErrors.set({});
    this.showResendLink.set(false);
    this.isSubmitting.set(true);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        const isAdmin = response.data.user.roles.includes('ADMIN');
        this.router.navigate([isAdmin ? '/admin' : '/dashboard']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const parsed = parseApiError(error);
        this.generalError.set(parsed.message);
        this.fieldErrors.set(parsed.fieldErrors);

        if (parsed.message === UNVERIFIED_EMAIL_MESSAGE) {
          this.showResendLink.set(true);
          this.resendForm.patchValue({ email: this.form.controls.email.value });
        }
      },
    });
  }

  submitForgotPassword(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isSendingForgot.set(true);
    this.forgotMessage.set(null);

    this.authService.forgotPassword(this.forgotForm.getRawValue()).subscribe({
      next: () => {
        this.isSendingForgot.set(false);
        this.forgotMessage.set('Si el correo existe, te enviamos un enlace de recuperación.');
      },
      error: () => {
        this.isSendingForgot.set(false);
        this.forgotMessage.set('Si el correo existe, te enviamos un enlace de recuperación.');
      },
    });
  }

  openResendVerification(): void {
    this.showResendVerification = true;
    this.resendMessage.set(null);
  }

  submitResendVerification(): void {
    if (this.resendForm.invalid) {
      this.resendForm.markAllAsTouched();
      return;
    }

    this.isSendingResend.set(true);
    this.resendMessage.set(null);

    this.authService.resendVerification(this.resendForm.getRawValue()).subscribe({
      next: () => {
        this.isSendingResend.set(false);
        this.resendMessage.set('Si el correo existe y no ha sido verificado, te enviamos un nuevo enlace.');
      },
      error: () => {
        // El backend no revela existencia/estado del correo: mismo mensaje siempre.
        this.isSendingResend.set(false);
        this.resendMessage.set('Si el correo existe y no ha sido verificado, te enviamos un nuevo enlace.');
      },
    });
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.touched && control.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.touched && control.hasError('email')) return 'Correo inválido.';
    return this.fieldErrors()[field] ?? null;
  }
}