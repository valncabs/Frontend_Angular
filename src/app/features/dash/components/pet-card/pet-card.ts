import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../../../../core/services/pet.models';

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

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-card.html',
})
export class PetCardComponent {
  @Input({ required: true }) pet!: Pet;

  @Output() edit = new EventEmitter<Pet>();
  @Output() delete = new EventEmitter<string>();

  get sexLabel(): string {
    return SEX_LABELS[this.pet.sex] ?? this.pet.sex;
  }

  get sizeLabel(): string {
    return SIZE_LABELS[this.pet.size] ?? this.pet.size;
  }

  onEdit(): void {
    this.edit.emit(this.pet);
  }

  onDelete(): void {
    this.delete.emit(this.pet.id);
  }
}
