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

  @Output() close = new EventEmitter<void>();

  get sizeClass(): string {
    const sizes: Record<ModalSize, string> = {
      md: 'max-w-md',
      lg: 'max-w-3xl',
      xl: 'max-w-5xl',
    };
    return sizes[this.size];
  }

  closeModal(): void {
    this.close.emit();
  }
}
