import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/** Visor de imagen a pantalla completa (lightbox). Expande la imagen con
 * una animación de zoom + fundido y permite cerrarla con el backdrop o el
 * botón de cierre. Es reutilizable desde cualquier card o modal. */
@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './image-viewer.html',
  styleUrl: './image-viewer.css',
})
export class ImageViewerComponent {
  @Input() isOpen = false;
  @Input() src: string | null = null;
  @Input() alt = '';

  @Output() close = new EventEmitter<void>();

  /** Detiene la propagación para que el click sobre la imagen no cierre el
   * visor (solo lo cierra el backdrop o el botón). */
  onImageClick(event: Event): void {
    event.stopPropagation();
  }

  onClose(): void {
    this.close.emit();
  }
}