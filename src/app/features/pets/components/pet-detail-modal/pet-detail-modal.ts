import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { ModalComponent } from '../../../../shared/components/modal/modal';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer';
import { Pet } from '../../data-access/pet.models';

const SEX_LABELS: Record<string, string> = {
  MALE: 'Macho',
  FEMALE: 'Hembra',
  UNKNOWN: 'No especificado',
};

const SIZE_LABELS: Record<string, string> = {
  SMALL: 'Pequeño',
  MEDIUM: 'Mediano',
  LARGE: 'Grande',
};

/** Modal de consulta de una mascota (solo lectura). Reutiliza el layout del
 * formulario de edición pero sin permitir editar. La foto es clickeable y se
 * expande a pantalla completa mediante el visor de imágenes. */
@Component({
  selector: 'app-pet-detail-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ModalComponent, ImageViewerComponent],
  templateUrl: './pet-detail-modal.html',
})
export class PetDetailModalComponent {
  @Input() isOpen = false;
  @Input() pet: Pet | null = null;

  @Output() close = new EventEmitter<void>();

  readonly viewerOpen = signal(false);

  get sexLabel(): string {
    return this.pet ? (SEX_LABELS[this.pet.sex] ?? this.pet.sex) : '';
  }

  get sizeLabel(): string {
    return this.pet ? (SIZE_LABELS[this.pet.size] ?? this.pet.size) : '';
  }

  get fullName(): string {
    if (!this.pet) return '';
    const parts = [this.pet.name];
    if (this.pet.speciesName) parts.push(this.pet.speciesName);
    if (this.pet.breedName) parts.push(this.pet.breedName);
    return parts.join(' · ');
  }

  onClose(): void {
    this.close.emit();
  }
}
