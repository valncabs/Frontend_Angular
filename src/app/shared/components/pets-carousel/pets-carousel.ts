import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pets-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pets-carousel.html',
})
export class PetsCarouselComponent {
  @Input() title = '';
  @Input() badge = '';
  @Input() isLost = true;

  pets = [
    {
      name: 'Max',
      breed: 'Golden Retriever',
      city: 'Barranquilla',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200',
    },
    {
      name: 'Luna',
      breed: 'Labrador',
      city: 'Soledad',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200',
    },
    {
      name: 'Rocky',
      breed: 'Mestizo',
      city: 'Malambo',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    },
  ];
}
