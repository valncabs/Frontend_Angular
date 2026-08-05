import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ModalSize = 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  /** Si es false, oculta el botón "Cerrar" y desactiva el click en el
   * backdrop. Úsalo para modales obligatorios como completar perfil. */
  @Input() dismissible = true;

  @Output() close = new EventEmitter<void>();

  get sizeClass(): string {
    const sizes: Record<ModalSize, string> = {
      md: 'max-w-md',
      lg: 'max-w-3xl',
      xl: 'max-w-5xl',
    };
    return sizes[this.size];
  }

  onBackdropClick(): void {
    if (this.dismissible) this.closeModal();
  }

  closeModal(): void {
    if (this.dismissible) this.close.emit();
  }
}
