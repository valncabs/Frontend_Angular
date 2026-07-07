import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../../components/my-pets/pet-models';
import { PetButtonComponent } from '../../components/button-pets/button-pets';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule, PetButtonComponent],
  templateUrl: './card-pets.html',
})

export class PetCardComponent {
  @Input() pet!: Pet;
  @Output() edit = new EventEmitter<Pet>();
  @Output() delete = new EventEmitter<string>();

  readonly sexLabel: Record<string, string> = {
    MALE: 'Macho',
    FEMALE: 'Hembra',
  };

  readonly sizeLabel: Record<string, string> = {
    SMALL: 'Pequeño',
    MEDIUM: 'Mediano',
    LARGE: 'Grande',
    EXTRA_LARGE: 'Extra grande',
  };

  readonly speciesEmoji: Record<string, string> = {
    Perro: '🐶',
    Gato: '🐱',
    default: '🐾',
  };

  getEmoji(speciesName?: string): string {
    if (!speciesName) return this.speciesEmoji['default'];
    return this.speciesEmoji[speciesName] ?? this.speciesEmoji['default'];
  }

  onEdit(): void {
    this.edit.emit(this.pet);
  }

  onDelete(): void {
    this.delete.emit(this.pet.id);
  }
}
