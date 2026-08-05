import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetCardComponent } from '../../components/pet-card/pet-card';
import { AddPetModalComponent } from '../../components/pets-modal/pets-modal';
import { PetDetailModalComponent } from '../../components/pet-detail-modal/pet-detail-modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Pet, Species, PetFormPayload, PetResponse } from '../../data-access/pet.models';
import { PetsService } from '../../data-access/pets';
import { CatalogService } from '../../../../core/services/catalog';

@Component({
  selector: 'app-my-pets-page',
  standalone: true,
  imports: [
    CommonModule,
    PetCardComponent,
    AddPetModalComponent,
    PetDetailModalComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './my-pets-page.html',
})
export class MyPetsPage implements OnInit {
  private readonly petsService = inject(PetsService);
  private readonly catalogService = inject(CatalogService);

  readonly pets = signal<Pet[]>([]);
  readonly species = signal<Species[]>([]);

  readonly isLoading = signal(false);
  readonly isModalOpen = signal(false);
  readonly savingPet = signal(false);
  readonly editingPet = signal<Pet | null>(null);
  readonly viewingPet = signal<Pet | null>(null);
  readonly deletingPet = signal<Pet | null>(null);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.catalogService.listSpecies().subscribe({
      next: (response) => this.species.set(response.data),
      error: () => this.errorMessage.set('No se pudieron cargar las especies del catálogo.'),
    });

    this.loadPets();
  }

  private loadPets(): void {
    this.petsService.listMine(1, 100).subscribe({
      next: (response) => {
        this.pets.set(
          response.data.items.map((item) => ({
            id: item.id,
            speciesId: item.species_id,
            speciesName: item.species_name,
            breedId: item.breed_id ?? undefined,
            breedName: item.breed_name ?? undefined,
            name: item.name,
            sex: item.sex,
            color: item.color,
            size: item.size,
            sterilized: false, // el listado no lo trae; se completa al editar
            photoUrl: item.primary_image_url ?? undefined,
          })),
        );
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('No se pudieron cargar tus mascotas.');
      },
    });
  }

  openAddModal(): void {
    this.editingPet.set(null);
    this.isModalOpen.set(true);
  }

  /** Al editar se pide el detalle completo (GET /pets/{id}), porque el
   * listado no trae sterilized/description. */
  openEditModal(pet: Pet): void {
    this.petsService.getById(pet.id).subscribe({
      next: (response) => {
        this.editingPet.set(this.mapDetail(response.data, pet));
        this.isModalOpen.set(true);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la mascota para editar.');
      },
    });
  }

  /** Abre el modal de consulta (solo lectura) con el detalle completo. */
  openViewModal(pet: Pet): void {
    this.petsService.getById(pet.id).subscribe({
      next: (response) => {
        this.viewingPet.set(this.mapDetail(response.data, pet));
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la mascota.');
      },
    });
  }

  /** Normaliza la respuesta del detalle a la forma interna Pet, reutilizada
   * por el modal de edición y por el modal de consulta. */
  private mapDetail(full: PetResponse, listItem: Pet): Pet {
    return {
      id: full.id,
      speciesId: full.species_id,
      speciesName: listItem.speciesName,
      breedId: full.breed_id ?? undefined,
      breedName: listItem.breedName,
      name: full.name,
      sex: full.sex,
      color: full.color,
      size: full.size,
      weight: full.weight ?? undefined,
      approximateAge: full.approximate_age ?? undefined,
      sterilized: full.sterilized,
      distinctiveMarks: full.distinctive_marks ?? undefined,
      description: full.description ?? undefined,
      photoUrl: listItem.photoUrl,
    };
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingPet.set(null);
  }

  closeViewModal(): void {
    this.viewingPet.set(null);
  }

  onSavedPet(payload: PetFormPayload): void {
    this.savingPet.set(true);
    const editing = this.editingPet();

    const request$ = editing
      ? this.petsService.update(editing.id, payload.data)
      : this.petsService.create(payload.data);

    request$.subscribe({
      next: (response) => {
        const petId = response.data.id;

        if (payload.photo) {
          this.petsService.uploadImage(petId, payload.photo, true).subscribe({
            next: () => this.afterSaveSuccess(),
            error: () => this.afterSaveSuccess(),
          });
        } else {
          this.afterSaveSuccess();
        }
      },
      error: () => {
        this.savingPet.set(false);
        this.errorMessage.set('No se pudo guardar la mascota. Intenta de nuevo.');
      },
    });
  }

  private afterSaveSuccess(): void {
    this.savingPet.set(false);
    this.closeModal();
    this.loadPets();
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
        this.deletingPet.set(null);
        this.loadPets();
      },
      error: () => {
        this.deletingPet.set(null);
        this.errorMessage.set('No se pudo eliminar la mascota.');
      },
    });
  }

  cancelDelete(): void {
    this.deletingPet.set(null);
  }
}
