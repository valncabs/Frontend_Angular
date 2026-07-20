import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PetInputComponent } from '../../components/pet-input/pet-input';
import { PetSelectComponent, SelectOption } from '../../components/select-pets/select-pets';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import {
  LocationPickerComponent,
  PickedLocation,
} from '../../../../shared/components/location-picker/location-picker';

import { PetsService } from '../../../../core/services/pets';
import { LostReportsService } from '../../../../core/services/lost-reports';
import { CreateLostReportRequest } from '../../../../core/services/lost-report-models';
import {
  COLOMBIA_DEPARTMENTS,
  DEFAULT_COUNTRY,
} from '../../../../core/services/colombia-locations';

@Component({
  selector: 'app-lost-report-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PetInputComponent,
    PetSelectComponent,
    PetButtonComponent,
    LocationPickerComponent,
  ],
  templateUrl: './lost-report-form.html',
})
export class LostReportFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly petsService = inject(PetsService);
  private readonly lostReportsService = inject(LostReportsService);

  form!: FormGroup;

  /** Si viene un :id en la ruta, estamos editando un reporte existente. */
  reportId = signal<string | null>(null);
  isEditMode = signal(false);

  loading = signal(false);
  submitting = signal(false);
  submitted = signal(false);
  generalError = signal<string | null>(null);

  petOptions = signal<SelectOption[]>([]);
  loadingPets = signal(false);

  readonly departmentOptions: SelectOption[] = COLOMBIA_DEPARTMENTS.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  cityOptions = signal<SelectOption[]>([]);

  ngOnInit(): void {
    this.buildForm();
    this.loadMyPets();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reportId.set(id);
      this.isEditMode.set(true);
      this.form.get('pet_id')?.disable();
      this.loadExistingReport(id);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      pet_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.maxLength(1000)],
      lost_date: ['', Validators.required],
      reward: [null, [Validators.min(0)]],
      contact_phone: ['', Validators.pattern(/^[0-9\s+-]{7,15}$/)],
      department: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });

    this.form.get('department')?.valueChanges.subscribe((deptValue: string) => {
      const dept = COLOMBIA_DEPARTMENTS.find((d) => d.value === deptValue);
      this.cityOptions.set(
        dept ? dept.cities.map((c) => ({ value: c.value, label: c.label })) : [],
      );
      this.form.get('city')?.setValue('', { emitEvent: false });
    });
  }

  private loadMyPets(): void {
    this.loadingPets.set(true);
    this.petsService.listMine(1, 100).subscribe({
      next: (res) => {
        this.petOptions.set(res.data.items.map((p) => ({ value: p.id, label: p.name })));
        this.loadingPets.set(false);
      },
      error: () => {
        this.generalError.set('No pudimos cargar tus mascotas.');
        this.loadingPets.set(false);
      },
    });
  }

  private loadExistingReport(id: string): void {
    this.loading.set(true);
    this.lostReportsService.getById(id).subscribe({
      next: (res) => {
        const report = res.data;
        this.form.patchValue({
          pet_id: report.pet_id,
          title: report.title,
          description: report.description ?? '',
          lost_date: report.lost_date,
          reward: report.reward,
          contact_phone: report.contact_phone ?? '',
          department: report.department,
          city: '', // se setea abajo, después de poblar cityOptions vía el valueChanges de department
          address: report.address ?? '',
          latitude: report.latitude,
          longitude: report.longitude,
        });
        // El valueChanges de 'department' ya pobló cityOptions; ahora sí asignamos 'city'.
        this.form.get('city')?.setValue(report.city);
        this.loading.set(false);
      },
      error: () => {
        this.generalError.set('No pudimos cargar el reporte.');
        this.loading.set(false);
      },
    });
  }

  onLocationPicked(location: PickedLocation): void {
    this.form.patchValue({
      latitude: location.lat,
      longitude: location.lng,
      ...(location.address ? { address: location.address } : {}),
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
    if (control.errors['pattern']) return 'Formato de teléfono inválido';
    return 'Valor inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.generalError.set(null);

    const raw = this.form.getRawValue();
    const payload: CreateLostReportRequest = {
      pet_id: raw.pet_id,
      title: raw.title,
      description: raw.description || undefined,
      lost_date: raw.lost_date,
      reward: raw.reward ? Number(raw.reward) : undefined,
      contact_phone: raw.contact_phone || undefined,
      country: DEFAULT_COUNTRY,
      department: raw.department,
      city: raw.city,
      address: raw.address,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };

    const id = this.reportId();

    if (this.isEditMode() && id) {
      const { pet_id, country, ...updatePayload } = payload;
      this.lostReportsService.update(id, updatePayload).subscribe({
        next: () => this.finishSubmit(),
        error: () => this.handleSubmitError(),
      });
    } else {
      this.lostReportsService.create(payload).subscribe({
        next: () => this.finishSubmit(),
        error: () => this.handleSubmitError(),
      });
    }
  }

  private finishSubmit(): void {
    this.submitting.set(false);
    this.submitted.set(true);
  }

  private handleSubmitError(): void {
    this.submitting.set(false);
    this.generalError.set('No pudimos guardar el reporte. Intenta de nuevo.');
  }

  goBack(): void {
    this.router.navigate(['/reportes']);
  }
}
