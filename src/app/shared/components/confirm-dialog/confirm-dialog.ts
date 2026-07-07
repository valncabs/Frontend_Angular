import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetButtonComponent } from '../button-pets/button-pets';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, PetButtonComponent],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = '¿Estás seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmLabel = 'Eliminar';
  @Input() cancelLabel = 'Cancelar';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }
  onCancel(): void {
    this.cancelled.emit();
  }
}
