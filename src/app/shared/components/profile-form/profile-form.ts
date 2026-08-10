import { Component, EventEmitter, Input, Output, inject, signal, OnInit, ViewChild, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CreateProfileRequest,
  DocumentType,
  Gender,
  ProfileResponse,
  UpdateProfileRequest,
} from '../../../features/profile/data-access/profile.models';
import { ProfileService } from '../../../features/profile/data-access/profile';
import { parseApiError } from '../../../core/services/api-error';
import { PetButtonComponent } from '../button-pets/button-pets';
import {
  PetSelectComponent,
  SelectOption,
} from '../../../features/pets/components/select-pets/select-pets';
import { LocationPickerComponent, PickedLocation } from '../location-picker/location-picker';
import {
  COLOMBIA_DEPARTMENTS,
  DEFAULT_COUNTRY,
  getDepartmentByValue,
  getCitiesByDepartment,
} from '../../../core/services/colombia-locations';

/** Fecha de nacimiento válida: no futura y con edad mínima de 15 años. */
function birthDateValidator(
  control: AbstractControl,
): { underAge?: true; futureDate?: true } | null {
  if (!control.value) return null;
  const value = new Date(`${control.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (value > today) return { futureDate: true };

  let age = today.getFullYear() - value.getFullYear();
  const m = today.getMonth() - value.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < value.getDate())) age--;
  return age < 15 ? { underAge: true } : null;
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PetButtonComponent,
    PetSelectComponent,
    LocationPickerComponent,
  ],
  templateUrl: './profile-form.html',
})
export class ProfileFormComponent implements OnInit {
  /** 'create': perfil aún no existe (POST). 'edit': perfil existe y se
   * actualiza (PATCH, solo campos modificados). */
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialValue: ProfileResponse | null = null;
  @Input() submitLabel = 'Guardar y continuar';

  @Output() saved = new EventEmitter<ProfileResponse>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);

  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});

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

  readonly departmentOptions: SelectOption[] = COLOMBIA_DEPARTMENTS.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  cityOptions = signal<SelectOption[]>([]);

  readonly form = this.fb.nonNullable.group({
    document_type: ['', [Validators.required]],
    document_number: ['', [Validators.required, Validators.minLength(3)]],
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    birth_date: ['', [birthDateValidator]],
    gender: [''],
    department: ['', [Validators.required]],
    city: ['', [Validators.required]],
    address: [{ value: '', disabled: true }, [Validators.required]],
    latitude: [null as number | null, Validators.required],
    longitude: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.form.get('department')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((deptValue: string) => {
        this.updateCityOptions(deptValue);
        this.form.get('city')?.setValue('', { emitEvent: false });
        this.clearMapSelection();
      });

    // Elegir una ciudad mueve el mapa a esa ciudad para que la ubicación del
    // perfil y lo que muestra el mapa siempre coincidan.
    this.form.get('city')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cityValue: string) => {
        this.focusMapOnCity(cityValue);
      });

    if (this.initialValue) {
      const departmentValue =
        this.findDepartmentValueByLabel(this.initialValue.department) ??
        this.initialValue.department;

      // Sin disparar valueChanges (evita geocodificar/mover el mapa al cargar).
      this.form.patchValue(
        {
          document_type: this.initialValue.document_type,
          document_number: this.initialValue.document_number,
          first_name: this.initialValue.first_name,
          last_name: this.initialValue.last_name,
          phone: this.initialValue.phone,
          birth_date: this.initialValue.birth_date ?? '',
          gender: this.initialValue.gender ?? '',
          department: departmentValue,
          city: '', // se setea abajo
          address: this.initialValue.address ?? '',
          latitude: this.initialValue.latitude,
          longitude: this.initialValue.longitude,
        },
        { emitEvent: false },
      );

      this.updateCityOptions(departmentValue);
      const cityValue =
        this.findCityValueByLabel(departmentValue, this.initialValue.city) ??
        this.initialValue.city;
      this.form.get('city')?.setValue(cityValue, { emitEvent: false });
    }
  }

  @ViewChild(LocationPickerComponent) private picker?: LocationPickerComponent;

  private updateCityOptions(deptValue: string): void {
    this.cityOptions.set(getDepartmentByValue(deptValue) ? getCitiesByDepartment(deptValue) : []);
  }

  private clearMapSelection(): void {
    this.form.patchValue(
      { latitude: null, longitude: null, address: '' },
      { emitEvent: false },
    );
    this.picker?.reset();
  }

  private focusMapOnCity(cityValue: string): void {
    if (!cityValue) return;
    const dept = getDepartmentByValue(this.form.get('department')?.value ?? '');
    const city = this.cityOptions().find((c) => c.value === cityValue);
    if (!dept || !city) return;

    this.form.patchValue(
      { latitude: null, longitude: null, address: '' },
      { emitEvent: false },
    );
    this.picker?.centerOn(city.label, dept.label);
  }

  private findDepartmentValueByLabel(label: string): string | null {
    return (
      COLOMBIA_DEPARTMENTS.find((d) => d.label.toLowerCase() === label?.toLowerCase())?.value ??
      null
    );
  }

  private findCityValueByLabel(departmentValue: string, label: string): string | null {
    return (
      getCitiesByDepartment(departmentValue).find(
        (c) => c.label.toLowerCase() === label?.toLowerCase(),
      )?.value ?? null
    );
  }

  /** Única fuente de lat/lng/dirección: lo que el usuario busca o mueve en
   * el mapa. Evita el desfase de antes (coordenadas de un lado, dirección
   * escrita a mano de otro). */
  onLocationPicked(location: PickedLocation): void {
    this.form.patchValue({
      latitude: location.lat,
      longitude: location.lng,
      ...(location.address ? { address: location.address } : {}),
    });
    this.form.controls.latitude.markAsDirty();
    this.form.controls.longitude.markAsDirty();
    this.form.controls.address.markAsDirty();

    // El punto elegido en el mapa define también el departamento/ciudad.
    this.applyPickedRegion(location.department, location.city);
  }

  /** Mapea las etiquetas del reverse geocoder a los slugs del select DIVIPOLA
   * sin disparar valueChanges (evita geocodificar/mover el mapa de vuelta). */
  private applyPickedRegion(department?: string, city?: string): void {
    if (!department && !city) return;

    const dept = department
      ? COLOMBIA_DEPARTMENTS.find(
          (d) => d.label.toLowerCase() === department.toLowerCase(),
        )
      : undefined;

    if (dept) {
      this.form.get('department')?.setValue(dept.value, { emitEvent: false });
      this.updateCityOptions(dept.value);
      if (city) {
        const cityMatch = getCitiesByDepartment(dept.value).find(
          (c) => c.label.toLowerCase() === city.toLowerCase(),
        );
        if (cityMatch) {
          this.form.get('city')?.setValue(cityMatch.value, { emitEvent: false });
        }
      }
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.generalError.set(null);
    this.fieldErrors.set({});
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();

    const request$ =
      this.mode === 'create'
        ? this.profileService.createProfile(this.buildCreatePayload(raw))
        : this.profileService.updateProfile(this.buildUpdatePayload(raw));

    request$.subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.saved.emit(response.data);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const parsed = parseApiError(error);
        this.generalError.set(parsed.message);
        this.fieldErrors.set(parsed.fieldErrors);
      },
    });
  }

  private buildCreatePayload(raw: ReturnType<typeof this.form.getRawValue>): CreateProfileRequest {
    return {
      document_type: raw.document_type as DocumentType,
      document_number: raw.document_number,
      first_name: raw.first_name,
      last_name: raw.last_name,
      phone: raw.phone,
      birth_date: raw.birth_date || null,
      gender: (raw.gender || null) as Gender | null,
      country: DEFAULT_COUNTRY,
      department: this.departmentLabel(raw.department),
      city: this.cityLabel(raw.department, raw.city),
      address: raw.address || null,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };
  }

  private buildUpdatePayload(raw: ReturnType<typeof this.form.getRawValue>): UpdateProfileRequest {
    const payload: UpdateProfileRequest = {};
    const controls = this.form.controls;

    if (controls.document_type.dirty) payload.document_type = raw.document_type as DocumentType;
    if (controls.document_number.dirty) payload.document_number = raw.document_number;
    if (controls.first_name.dirty) payload.first_name = raw.first_name;
    if (controls.last_name.dirty) payload.last_name = raw.last_name;
    if (controls.phone.dirty) payload.phone = raw.phone;
    if (controls.birth_date.dirty) payload.birth_date = raw.birth_date || null;
    if (controls.gender.dirty) payload.gender = (raw.gender || null) as Gender | null;
    if (controls.department.dirty) payload.department = this.departmentLabel(raw.department);
    if (controls.city.dirty) payload.city = this.cityLabel(raw.department, raw.city);
    if (controls.address.dirty) payload.address = raw.address || null;
    if (controls.latitude.dirty) payload.latitude = raw.latitude;
    if (controls.longitude.dirty) payload.longitude = raw.longitude;

    return payload;
  }

  private departmentLabel(value: string): string {
    return getDepartmentByValue(value)?.label ?? value;
  }

  private cityLabel(departmentValue: string, cityValue: string): string {
    return (
      getCitiesByDepartment(departmentValue).find((c) => c.value === cityValue)?.label ?? cityValue
    );
  }

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.touched && control.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.touched && control.hasError('minlength')) return 'Muy corto.';
    if (control?.touched && control.hasError('futureDate'))
      return 'La fecha de nacimiento no puede ser en el futuro.';
    if (control?.touched && control.hasError('underAge'))
      return 'Debes tener al menos 15 años para registrarte.';
    return this.fieldErrors()[field] ?? null;
  }
}
