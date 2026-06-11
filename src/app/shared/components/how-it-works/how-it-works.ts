import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.html',
})
export class HowItWorksComponent {
  steps = [
    {
      icon: 'bi bi-megaphone',
      title: 'Publica un reporte',
      description: 'Reporta una mascota perdida o encontrada en pocos minutos.',
    },
    {
      icon: 'bi bi-geo-alt',
      title: 'Ubicación cercana',
      description: 'Las personas cercanas podrán ver el reporte rápidamente.',
    },
    {
      icon: 'bi bi-heart',
      title: 'Reencuentro',
      description: 'Aumenta las probabilidades de volver a casa.',
    },
  ];
}
