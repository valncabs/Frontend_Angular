import { Component } from '@angular/core';

import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout';
import { EmailInputComponent } from '../../../../shared/components/email-input/email-input';
import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input';
import { ModalComponent } from '../../../../shared/components/modal/modal';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutComponent, EmailInputComponent, PasswordInputComponent, ModalComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {
  showForgotPassword = false;
}
