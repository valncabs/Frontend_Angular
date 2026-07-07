import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetButtonComponent } from '../button-pets/button-pets';
import { PetCardComponent } from '../card-pets/card-pets';
import { AddPetModalComponent } from '../pets-modal/pets-modal';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { Pet, Species, Breed, PetFormPayload } from './pet-models';

const MOCK_SPECIES: Species[] = [
  { id: 'sp-1', name: 'Perro' },
  { id: 'sp-2', name: 'Gato' },
  { id: 'sp-3', name: 'Ave' },
  { id: 'sp-4', name: 'Conejo' },
  { id: 'sp-5', name: 'Reptil' },
];

const MOCK_BREEDS: Breed[] = [
  { id: 'br-1', name: 'Labrador Retriever', speciesId: 'sp-1' },
  { id: 'br-2', name: 'Pastor Alemán', speciesId: 'sp-1' },
  { id: 'br-6', name: 'Persa', speciesId: 'sp-2' },
  { id: 'br-7', name: 'Siamés', speciesId: 'sp-2' },
];

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    PetButtonComponent,
    PetCardComponent,
    AddPetModalComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './my-pets.html',
})
export class MyPetsComponent implements OnInit {
  pets = signal<Pet[]>([]);
  species = signal<Species[]>([]);
  breeds = signal<Breed[]>([]);

  isModalOpen = signal(false);
  savingPet = signal(false);
  editingPet = signal<Pet | null>(null);
  deletingPet = signal<Pet | null>(null);

  ngOnInit(): void {
    this.species.set(MOCK_SPECIES);
    this.breeds.set(MOCK_BREEDS);
  }

  openAddModal(): void {
    this.editingPet.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(pet: Pet): void {
    this.editingPet.set(pet);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingPet.set(null);
  }

  onSavedPet(payload: PetFormPayload): void {
    this.savingPet.set(true);

    setTimeout(() => {
      const speciesName = this.species().find((s) => s.id === payload.data.species_id)?.name;
      const breedName = this.breeds().find((b) => b.id === payload.data.breed_id)?.name;
      const editing = this.editingPet();
      const photoUrl = payload.photo ? URL.createObjectURL(payload.photo) : editing?.photoUrl;

      if (editing) {
        this.pets.update((list) =>
          list.map((p) =>
            p.id === editing.id
              ? {
                  ...p,
                  speciesId: payload.data.species_id,
                  speciesName,
                  breedId: payload.data.breed_id,
                  breedName,
                  name: payload.data.name,
                  sex: payload.data.sex,
                  color: payload.data.color,
                  size: payload.data.size,
                  weight: payload.data.weight,
                  approximateAge: payload.data.approximate_age,
                  sterilized: payload.data.sterilized,
                  distinctiveMarks: payload.data.distinctive_marks,
                  description: payload.data.description,
                  photoUrl,
                }
              : p,
          ),
        );
      } else {
        const newPet: Pet = {
          id: crypto.randomUUID(),
          speciesId: payload.data.species_id,
          speciesName,
          breedId: payload.data.breed_id,
          breedName,
          name: payload.data.name,
          sex: payload.data.sex,
          color: payload.data.color,
          size: payload.data.size,
          weight: payload.data.weight,
          approximateAge: payload.data.approximate_age,
          sterilized: payload.data.sterilized,
          distinctiveMarks: payload.data.distinctive_marks,
          description: payload.data.description,
          photoUrl,
        };
        this.pets.update((list) => [...list, newPet]);
      }

      this.savingPet.set(false);
      this.closeModal();
    }, 800);
  }

  requestDelete(petId: string): void {
    const pet = this.pets().find((p) => p.id === petId) ?? null;
    this.deletingPet.set(pet);
  }

  confirmDelete(): void {
    const pet = this.deletingPet();
    if (pet) {
      this.pets.update((list) => list.filter((p) => p.id !== pet.id));
    }
    this.deletingPet.set(null);
  }

  cancelDelete(): void {
    this.deletingPet.set(null);
  }
}
