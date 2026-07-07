import { Component } from '@angular/core';
import { AuthCard } from '../../../auth/components/auth-card/auth-card';
import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { PasswordInputComponent } from '../../../auth/components/password-input/password-input';
@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    AuthCard,
    AuthLayoutComponent,
    PasswordInputComponent
  ],
  templateUrl: './reset-password-page.html',
})
export class ResetPasswordPage {}