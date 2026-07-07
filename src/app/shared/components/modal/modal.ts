import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html'
})
export class ModalComponent {

  @Input() isOpen = false;
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

}