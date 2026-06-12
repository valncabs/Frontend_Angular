import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html'
})
export class FaqComponent {
  faqs = [
    {
      question: '¿Cómo reporto una mascota perdida?',
      answer: 'Solo debes registrarte y completar el formulario.',
    },
    {
      question: '¿Tiene algún costo?',
      answer: 'No, Pet-Centric es totalmente gratuito.',
    },
    {
      question: '¿Cómo contacto al reportante?',
      answer: 'Dentro del reporte encontrarás medios de contacto.',
    },
  ];
}
