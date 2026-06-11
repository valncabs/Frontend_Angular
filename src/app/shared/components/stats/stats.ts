import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
})
export class StatsComponent {
  stats = [
    {
      icon: 'bi bi-heart-pulse',
      value: '+2,500',
      label: 'Mascotas reunidas',
    },
    {
      icon: 'bi bi-people',
      value: '+12,000',
      label: 'Usuarios registrados',
    },
    {
      icon: 'bi bi-megaphone',
      value: '+8,400',
      label: 'Reportes publicados',
    },
    {
      icon: 'bi bi-geo-alt',
      value: '+50',
      label: 'Zonas cubiertas',
    },
  ];
}
