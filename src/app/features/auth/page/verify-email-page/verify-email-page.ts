import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { AuthCard } from '../../../auth/components/auth-card/auth-card';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [
    CommonModule,
    AuthLayoutComponent,
    AuthCard
  ],
  templateUrl: './verify-email-page.html',
})
export class VerifyEmailPage {
  isSuccess = true; // o false según la respuesta del backend
}