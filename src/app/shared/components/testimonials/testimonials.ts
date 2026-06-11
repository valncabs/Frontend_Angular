import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Laura Gómez',
      city: 'Barranquilla',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'Gracias a Pet-Centric encontré a Luna en menos de 24 horas.',
    },
    {
      name: 'Carlos Ruiz',
      city: 'Soledad',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'La plataforma es fácil de usar y realmente ayuda.',
    },
    {
      name: 'Mariana Pérez',
      city: 'Malambo',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      text: 'Publicamos el reporte y varias personas ayudaron rápidamente.',
    },
  ];
}
