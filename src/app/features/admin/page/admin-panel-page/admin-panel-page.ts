import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoPerfilComponent } from '../../../../shared/components/info-perfil/info-perfil';

@Component({
  selector: 'app-admin-panel-page',
  standalone: true,
  imports: [CommonModule, FormsModule, InfoPerfilComponent],
  templateUrl: './admin-panel-page.html',
})
export class AdminPanelPage {
  }