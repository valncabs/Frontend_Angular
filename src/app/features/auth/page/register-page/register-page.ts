import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { EmailInputComponent } from '../../../auth/components/email-input/email-input';
import { PasswordInputComponent } from '../../../auth/components/password-input/password-input';
import { AuthService } from '../../../../core/services/auth';
import { parseApiError } from '../../../../core/services/api-error';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    EmailInputComponent,
    PasswordInputComponent,
  ],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});
  readonly registered = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.generalError.set(null);
    this.fieldErrors.set({});
    this.isSubmitting.set(true);

    const { email, password } = this.form.getRawValue();

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.registered.set(true);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const parsed = parseApiError(error);
        this.generalError.set(parsed.message);
        this.fieldErrors.set(parsed.fieldErrors);
      },
    });
  }

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.touched && control.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.touched && control.hasError('email')) return 'Correo inválido.';
    if (control?.touched && control.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (field === 'confirmPassword' && this.form.hasError('passwordsMismatch') && control?.touched) {
      return 'Las contraseñas no coinciden.';
    }
    return this.fieldErrors()[field] ?? null;
  }
}