import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CreateProfileRequest,
  DocumentType,
  Gender,
} from '../../../../core/services/profile.models';
import { ProfileService } from '../../../../core/services/profile';
import { parseApiError } from '../../../../core/services/api-error';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-page-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PetButtonComponent],
  templateUrl: './page-my-profile.html',
})
export class PageMyProfile {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});
  readonly locationLoading = signal(false);
  readonly locationError = signal<string | null>(null);

  readonly documentTypeOptions: SelectOption[] = [
    { value: 'CC', label: 'Cédula de ciudadanía' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'TI', label: 'Tarjeta de identidad' },
    { value: 'PASSPORT', label: 'Pasaporte' },
  ];

  readonly genderOptions: SelectOption[] = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Femenino' },
    { value: 'UNKNOWN', label: 'Prefiero no decirlo' },
  ];

  readonly form = this.fb.nonNullable.group({
    document_type: ['', [Validators.required]],
    document_number: ['', [Validators.required, Validators.minLength(3)]],
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    birth_date: [''],
    gender: [''],
    country: ['', [Validators.required]],
    department: ['', [Validators.required]],
    city: ['', [Validators.required]],
    address: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.generalError.set(null);
    this.fieldErrors.set({});
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();

    const payload: CreateProfileRequest = {
      document_type: raw.document_type as DocumentType,
      document_number: raw.document_number,
      first_name: raw.first_name,
      last_name: raw.last_name,
      phone: raw.phone,
      birth_date: raw.birth_date || null,
      gender: (raw.gender || null) as Gender | null,
      country: raw.country,
      department: raw.department,
      city: raw.city,
      address: raw.address || null,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };

    this.profileService.createProfile(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const parsed = parseApiError(error);
        this.generalError.set(parsed.message);
        this.fieldErrors.set(parsed.fieldErrors);
      },
    });
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set('Tu navegador no soporta geolocalización.');
      return;
    }

    this.locationLoading.set(true);
    this.locationError.set(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.form.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.locationLoading.set(false);
      },
      () => {
        this.locationError.set('No pudimos obtener tu ubicación. Actívala en tu navegador.');
        this.locationLoading.set(false);
      },
    );
  }

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.touched && control.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.touched && control.hasError('minlength')) return 'Muy corto.';
    return this.fieldErrors()[field] ?? null;
  }
}
