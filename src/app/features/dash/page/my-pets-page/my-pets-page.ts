import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { PetCardComponent } from '../../../../features/dash/components/pet-card/pet-card';
import { AddPetModalComponent } from '../../../../features/dash/components/pets-modal/pets-modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Pet, Species, Breed, PetFormPayload } from '../../../../core/services/pet.models';
import { PetsService } from '../../../../core/services/pets';
import { CatalogService } from '../../../../core/services/catalog';
import { PetListItem, PetResponse } from '../../../../core/services/pet.models';

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [CommonModule, PetCardComponent, AddPetModalComponent, ConfirmDialogComponent],
  templateUrl: './my-pets-page.html',
})
export class MyPets implements OnInit {
  pets = signal<Pet[]>([]);
  species = signal<Species[]>([]);
  breeds = signal<Breed[]>([]);

  isLoading = signal(false);
  isModalOpen = signal(false);
  savingPet = signal(false);
  editingPet = signal<Pet | null>(null);
  deletingPet = signal<Pet | null>(null);
  generalError = signal<string | null>(null);

  constructor(
    private readonly petsService: PetsService,
    private readonly catalogService: CatalogService,
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading.set(true);

    this.catalogService.listSpecies().subscribe({
      next: (response) => {
        this.species.set(response.data.map((s) => ({ id: s.id, name: s.name })));
        this.loadAllBreeds(response.data.map((s) => s.id));
      },
      error: () => this.generalError.set('No pudimos cargar las especies.'),
    });

    this.loadMyPets();
  }

  private loadAllBreeds(speciesIds: string[]): void {
    if (speciesIds.length === 0) return;

    forkJoin(speciesIds.map((id) => this.catalogService.listBreeds(id))).subscribe({
      next: (responses) => {
        const allBreeds = responses.flatMap((r) =>
          r.data.map((b) => ({ id: b.id, name: b.name, speciesId: b.species_id })),
        );
        this.breeds.set(allBreeds);
      },
      error: () => this.generalError.set('No pudimos cargar las razas.'),
    });
  }

  private loadMyPets(): void {
    this.petsService.listMine().subscribe({
      next: (response) => {
        const items = response.data.items;
        if (items.length === 0) {
          this.pets.set([]);
          this.isLoading.set(false);
          return;
        }

        forkJoin(items.map((item) => this.petsService.listImages(item.id))).subscribe({
          next: (imagesResponses) => {
            const petsWithPhotos = items.map((item, index) => {
              const images = imagesResponses[index].data;
              const primary = images.find((img) => img.is_primary) ?? images[0];
              return this.toPetFromListItem(item, primary?.url);
            });
            this.pets.set(petsWithPhotos);
            this.isLoading.set(false);
          },
          error: () => {
            // Si fallan las imágenes, igual mostramos las mascotas sin foto.
            this.pets.set(items.map((item) => this.toPetFromListItem(item)));
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.generalError.set('No pudimos cargar tus mascotas.');
        this.isLoading.set(false);
      },
    });
  }

  private toPetFromListItem(item: PetListItem, photoUrl?: string): Pet {
    return {
      id: item.id,
      speciesId: item.species_id,
      speciesName: this.species().find((s) => s.id === item.species_id)?.name,
      breedId: item.breed_id ?? undefined,
      breedName: this.breeds().find((b) => b.id === item.breed_id)?.name,
      name: item.name,
      sex: item.sex,
      color: item.color,
      size: item.size,
      weight: undefined,
      approximateAge: undefined,
      sterilized: false,
      distinctiveMarks: undefined,
      description: undefined,
      photoUrl,
    } as Pet;
  }

  private toPetFromResponse(pet: PetResponse, photoUrl?: string): Pet {
    return {
      id: pet.id,
      speciesId: pet.species_id,
      speciesName: this.species().find((s) => s.id === pet.species_id)?.name,
      breedId: pet.breed_id ?? undefined,
      breedName: this.breeds().find((b) => b.id === pet.breed_id)?.name,
      name: pet.name,
      sex: pet.sex,
      color: pet.color,
      size: pet.size,
      weight: pet.weight ?? undefined,
      approximateAge: pet.approximate_age ?? undefined,
      sterilized: pet.sterilized,
      distinctiveMarks: pet.distinctive_marks ?? undefined,
      description: pet.description ?? undefined,
      photoUrl,
    } as Pet;
  }

  openAddModal(): void {
    this.editingPet.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(pet: Pet): void {
    this.petsService.getById(pet.id).subscribe({
      next: (response) => {
        this.editingPet.set(this.toPetFromResponse(response.data, pet.photoUrl));
        this.isModalOpen.set(true);
      },
      error: () => this.generalError.set('No pudimos cargar los datos de la mascota.'),
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingPet.set(null);
  }

  onSavedPet(payload: PetFormPayload): void {
    this.savingPet.set(true);
    this.generalError.set(null);

    const editing = this.editingPet();

    if (editing) {
      this.petsService.update(editing.id, payload.data).subscribe({
        next: (response) => this.handleSaveSuccess(response.data, payload.photo),
        error: () => this.handleSaveError(),
      });
    } else {
      this.petsService.create(payload.data).subscribe({
        next: (response) => this.handleSaveSuccess(response.data, payload.photo),
        error: () => this.handleSaveError(),
      });
    }
  }

  private handleSaveSuccess(pet: PetResponse, photo: File | null): void {
    const editing = this.editingPet();
    const previousPhotoUrl = editing?.photoUrl;

    if (photo) {
      this.petsService.uploadImage(pet.id, photo, true).subscribe({
        next: (imgResponse) => this.finishSave(pet, imgResponse.data.url),
        // Si la mascota se guardó pero la nueva imagen falló al subir,
        // conservamos la foto anterior en vez de perderla.
        error: () => this.finishSave(pet, previousPhotoUrl),
      });
    } else {
      this.finishSave(pet, previousPhotoUrl);
    }
  }

  private finishSave(pet: PetResponse, photoUrl?: string): void {
    const newPet = this.toPetFromResponse(pet, photoUrl);
    const editing = this.editingPet();

    if (editing) {
      this.pets.update((list) => list.map((p) => (p.id === editing.id ? newPet : p)));
    } else {
      this.pets.update((list) => [...list, newPet]);
    }

    this.savingPet.set(false);
    this.closeModal();
  }

  private handleSaveError(): void {
    this.savingPet.set(false);
    this.generalError.set('No pudimos guardar la mascota. Intenta de nuevo.');
  }

  requestDelete(petId: string): void {
    const pet = this.pets().find((p) => p.id === petId) ?? null;
    this.deletingPet.set(pet);
  }

  confirmDelete(): void {
    const pet = this.deletingPet();
    if (!pet) return;

    this.petsService.delete(pet.id).subscribe({
      next: () => {
        this.pets.update((list) => list.filter((p) => p.id !== pet.id));
        this.deletingPet.set(null);
      },
      error: () => {
        this.generalError.set('No pudimos eliminar la mascota.');
        this.deletingPet.set(null);
      },
    });
  }

  cancelDelete(): void {
    this.deletingPet.set(null);
  }
}
