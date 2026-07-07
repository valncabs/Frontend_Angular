import { Component } from '@angular/core';

import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { EmailInputComponent } from '../../../auth/components/email-input/email-input';
import { PasswordInputComponent } from '../../../auth/components/password-input/password-input';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutComponent, EmailInputComponent, PasswordInputComponent, ModalComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {
  showForgotPassword = false;
   constructor(private router: Router) {}

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

}