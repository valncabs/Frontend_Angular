import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { AuthCard } from '../.././../auth/components/auth-card/auth-card';
import { EmailInputComponent } from '../../../auth/components/email-input/email-input'; 
@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    AuthLayoutComponent,
    AuthCard,
    EmailInputComponent
  ],
  templateUrl: './forgot-password-page.html',
})
export class ForgotPasswordPage {}