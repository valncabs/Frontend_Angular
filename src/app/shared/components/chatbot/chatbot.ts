import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ChatbotService } from '../../../core/services/chatbot';
import { ViewChild, ElementRef } from '@angular/core';
/* ===========================
   Interfaces
=========================== */

interface Fuente {

  documento: string;

  pagina: number;

  fragmento: string;

}

interface Mensaje {

  usuario: boolean;

  texto: string;

  fuentes?: Fuente[];

}

/* ===========================
   Componente
=========================== */

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatbotComponent {
@ViewChild('scrollRef') scrollRef!: ElementRef;
private scrollToBottom() {
  setTimeout(() => {
    this.scrollRef.nativeElement.scrollTop =
      this.scrollRef.nativeElement.scrollHeight;
  });
}
  abierto = false;

  pregunta = '';

  cargando = false;

  mensajes: Mensaje[] = [];

constructor(
  private chatbot: ChatbotService,
  private cdr: ChangeDetectorRef
) {}

  abrirCerrar(): void {

    this.abierto = !this.abierto;

  }

  enviar(): void {

    if (!this.pregunta.trim()) {
      return;
    }

    const texto = this.pregunta.trim();

    // Agregar mensaje del usuario
    this.mensajes.push({
      usuario: true,
      texto: texto
    });

    this.pregunta = '';

    this.cargando = true;

    this.chatbot.ask(texto).subscribe({

      next: (resp) => {

        this.cargando = false;
this.mensajes.push({
  usuario: false,
  texto: resp.answer
});

        this.cdr.detectChanges();

      },

      error: () => {

        this.cargando = false;

        this.mensajes.push({
          usuario: false,
          texto: 'Lo siento 😿, ocurrió un error al conectar con Pet AI.'
        });

        this.cdr.detectChanges();

      }

          });

        }

}