import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmailInputComponent } from '../../../auth/components/email-input/email-input';
import { PasswordInputComponent } from '../../../auth/components/password-input/password-input';
import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, EmailInputComponent, PasswordInputComponent, AuthLayoutComponent],
  templateUrl: './register-page.html',
})
export class RegisterPage {}
