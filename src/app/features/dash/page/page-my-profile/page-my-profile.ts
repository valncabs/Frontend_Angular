import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPerfilComponent } from '../../../../shared/components/info-perfil/info-perfil';

@Component({
  selector: 'app-page-my-profile',
  standalone: true,
  imports: [CommonModule, InfoPerfilComponent],
  templateUrl: './page-my-profile.html',
})
export class PageMyProfile {}