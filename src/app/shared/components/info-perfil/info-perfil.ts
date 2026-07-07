import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-perfil.html',
})
export class InfoPerfilComponent {

  private auth = inject(AuthService);
  userProfile$ = this.auth.user$ as Observable<any>;
}