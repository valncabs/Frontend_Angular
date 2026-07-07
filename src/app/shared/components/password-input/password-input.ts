import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [],
  templateUrl: './password-input.html',

})
export class PasswordInputComponent {
  @Input() label: string = 'Contraseña';
  @Input() placeholder: string = '••••••••';
}