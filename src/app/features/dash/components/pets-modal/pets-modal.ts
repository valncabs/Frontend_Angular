import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ModalComponent } from '../../../../shared/components/modal/modal';
import { PetInputComponent } from '../../../../features/dash/components/pet-input/pet-input';
import { PetSelectComponent, SelectOption } from '../select-pets/select-pets';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import {
  CreatePetDto,
  Species,
  Breed,
  Pet,
  PetFormPayload,
} from '../../../../core/services/pet.models';

@Component({
  selector: 'app-add-pet-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    PetInputComponent,
    PetSelectComponent,
    PetButtonComponent,
  ],
  templateUrl: './pets-modal.html',
})
export class AddPetModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() species: Species[] = [];
  @Input() breeds: Breed[] = [];
  @Input() loading = false;
  @Input() petToEdit: Pet | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<PetFormPayload>();

  private fb = inject(FormBuilder);

  form!: FormGroup;
  filteredBreeds: Breed[] = [];

  photoPreview = signal<string | null>(null);
  photoError = '';
  private selectedPhoto: File | null = null;

  readonly sexOptions: SelectOption[] = [
    { value: 'MALE', label: 'Macho' },
    { value: 'FEMALE', label: 'Hembra' },
    { value: 'UNKNOWN', label: 'No especificado' },
  ];

  readonly sizeOptions: SelectOption[] = [
    { value: 'SMALL', label: 'Pequeño' },
    { value: 'MEDIUM', label: 'Mediano' },
    { value: 'LARGE', label: 'Grande' },
  ];
  get speciesOptions(): SelectOption[] {
    return this.species.map((s) => ({ value: s.id, label: s.name }));
  }

  get breedOptions(): SelectOption[] {
    return this.filteredBreeds.map((b) => ({ value: b.id, label: b.name }));
  }

  get modalTitle(): string {
    return this.petToEdit ? 'Editar mascota' : 'Agregar nueva mascota';
  }

  get submitLabel(): string {
    return this.petToEdit ? 'Guardar cambios' : 'Guardar mascota';
  }

  ngOnInit(): void {
    if (!this.form) {
      this.buildForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.photoError = '';
      this.selectedPhoto = null;

      if (!this.form) {
        this.buildForm();
      }

      if (this.petToEdit) {
        this.filteredBreeds = this.breeds.filter((b) => b.speciesId === this.petToEdit!.speciesId);
        this.form.patchValue({
          species_id: this.petToEdit.speciesId,
          breed_id: this.petToEdit.breedId ?? '',
          name: this.petToEdit.name,
          sex: this.petToEdit.sex,
          color: this.petToEdit.color,
          size: this.petToEdit.size,
          weight: this.petToEdit.weight ?? null,
          approximate_age: this.petToEdit.approximateAge ?? null,
          sterilized: this.petToEdit.sterilized,
          distinctive_marks: this.petToEdit.distinctiveMarks ?? '',
          description: this.petToEdit.description ?? '',
        });
        this.photoPreview.set(this.petToEdit.photoUrl ?? null);
      } else {
        this.filteredBreeds = [];
        this.form.reset({
          species_id: '',
          breed_id: '',
          name: '',
          sex: '',
          color: '',
          size: '',
          weight: null,
          approximate_age: null,
          sterilized: false,
          distinctive_marks: '',
          description: '',
        });
        this.photoPreview.set(null);
      }
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      species_id: ['', Validators.required],
      breed_id: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      sex: ['', Validators.required],
      color: ['', [Validators.required, Validators.maxLength(100)]],
      size: ['', Validators.required],
      weight: [null, [Validators.min(0), Validators.max(999)]],
      approximate_age: [null, [Validators.min(0), Validators.max(99)]],
      sterilized: [false],
      distinctive_marks: [''],
      description: [''],
    });

    this.form.get('species_id')?.valueChanges.subscribe((speciesId: string) => {
      if (speciesId) {
        this.filteredBreeds = this.breeds.filter((b) => b.speciesId === speciesId);
      } else {
        this.filteredBreeds = [];
      }

      if (!this.petToEdit) {
        this.form.get('breed_id')?.setValue('', { emitEvent: false });
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['maxlength']) return 'Máximo de caracteres excedido';
    if (control.errors['min']) return 'El valor no puede ser negativo';
    return 'Valor inválido';
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.photoError = 'El archivo debe ser una imagen';
      input.value = '';
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      this.photoError = `La imagen no puede superar los ${maxSizeMb}MB`;
      input.value = '';
      return;
    }

    this.photoError = '';
    this.selectedPhoto = file;

    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.selectedPhoto = null;
    this.photoPreview.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value;
    const dto: CreatePetDto = {
      ...raw,
      breed_id: raw.breed_id || undefined,
      weight: raw.weight ? Number(raw.weight) : undefined,
      approximate_age: raw.approximate_age ? Number(raw.approximate_age) : undefined,
      distinctive_marks: raw.distinctive_marks || undefined,
      description: raw.description || undefined,
      sterilized: !!raw.sterilized,
    };

    this.saved.emit({ data: dto, photo: this.selectedPhoto });
  }

  onClose(): void {
    this.close.emit();
  }
}
