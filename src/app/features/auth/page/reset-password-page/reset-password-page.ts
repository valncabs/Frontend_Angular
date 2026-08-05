import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { AuthCard } from '../../../auth/components/auth-card/auth-card';
import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { PasswordInputComponent } from '../../../auth/components/password-input/password-input';
import { AuthService } from '../../../../core/services/auth';
import { parseApiError } from '../../../../core/services/api-error';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, AuthCard, AuthLayoutComponent, PasswordInputComponent],
  templateUrl: './reset-password-page.html',
})
export class ResetPasswordPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private token: string | null = null;

  readonly hasToken = signal(true);
  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | null>(null);
  readonly success = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.hasToken.set(false);
    }
  }

  submit(): void {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }

    this.generalError.set(null);
    this.isSubmitting.set(true);

    const { password } = this.form.getRawValue();

    this.authService.resetPassword({ token: this.token, new_password: password }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.success.set(true);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const parsed = parseApiError(error);
        this.generalError.set(parsed.message);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.touched && control.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.touched && control.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (field === 'confirmPassword' && this.form.hasError('passwordsMismatch') && control?.touched) {
      return 'Las contraseñas no coinciden.';
    }
    return null;
  }
}