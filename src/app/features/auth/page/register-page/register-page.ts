import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmailInputComponent } from '../../../../shared/components/email-input/email-input';
import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, EmailInputComponent, PasswordInputComponent, AuthLayoutComponent],
  templateUrl: './register-page.html',
})
export class RegisterPage {}
