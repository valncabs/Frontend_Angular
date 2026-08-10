import { Component, OnInit, inject, signal, ViewChild, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { PetInputComponent } from '../../../../shared/components/pet-input/pet-input';
import { PetSelectComponent, SelectOption } from '../../../pets/components/select-pets/select-pets';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import {
  LocationPickerComponent,
  PickedLocation,
} from '../../../../shared/components/location-picker/location-picker';

import { PetsService } from '../../../pets/data-access/pets';
import { LostReportsService } from '../../../reports/data-access/lost-reports';
import {
  CreateLostReportRequest,
  LostReportImageResponse,
} from '../../../reports/data-access/lost-report-models';
import { parseApiError } from '../../../../core/services/api-error';
import {
  COLOMBIA_DEPARTMENTS,
  DEFAULT_COUNTRY,
  getDepartmentByValue,
  getCitiesByDepartment,
} from '../../../../core/services/colombia-locations';

/** La fecha de pérdida no puede ser posterior a hoy. */
function noFutureDate(control: AbstractControl): { futureDate: true } | null {
  if (!control.value) return null;
  const value = new Date(`${control.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return value > today ? { futureDate: true } : null;
}

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
  private readonly destroyRef = inject(DestroyRef);
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

  // ---------- Fotos del reporte ----------
  existingImages = signal<LostReportImageResponse[]>([]);
  newPhotos = signal<{ file: File; preview: string }[]>([]);
  photoError = signal('');
  uploadingPhotos = signal(false);

  /** Mascotas con un reporte de pérdida activo: se muestran en el select
   * pero deshabilitadas, con su aviso. */
  blockedPetsCount = signal(0);

  /** Error del backend asociado al select de mascota (ej. reporte activo). */
  petIdError = signal<string | null>(null);

  readonly departmentOptions: SelectOption[] = COLOMBIA_DEPARTMENTS.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  cityOptions = signal<SelectOption[]>([]);

  @ViewChild(LocationPickerComponent) private picker?: LocationPickerComponent;

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
      lost_date: ['', [Validators.required, noFutureDate]],
      reward: [null, [Validators.min(0), Validators.max(99999999.99)]],
      contact_phone: ['', Validators.pattern(/^[0-9\s+-]{7,15}$/)],
      department: ['', Validators.required],
      city: ['', Validators.required],
      address: [{ value: '', disabled: true }, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });

    // Al cambiar el departamento manualmente, la ubicación del mapa ya no
    // corresponde: se limpia el pin y la dirección hasta elegir una ciudad.
    this.form.get('department')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((deptValue: string) => {
        this.updateCityOptions(deptValue);
        this.form.get('city')?.setValue('', { emitEvent: false });
        this.clearMapSelection();
      });

    // Elegir una ciudad mueve el mapa a esa ciudad para que coincidan la
    // "última ubicación conocida" y lo que muestra el mapa.
    this.form.get('city')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cityValue: string) => {
        this.focusMapOnCity(cityValue);
      });
  }

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
    const dept = getDepartmentByValue(this.form.get('department')?.value);
    const city = this.cityOptions().find((c) => c.value === cityValue);
    if (!dept || !city) return;

    this.form.patchValue(
      { latitude: null, longitude: null, address: '' },
      { emitEvent: false },
    );
    this.picker?.centerOn(city.label, dept.label);
  }

  private loadMyPets(): void {
    this.loadingPets.set(true);
    forkJoin({
      pets: this.petsService.listMine(1, 100),
      myReports: this.lostReportsService
        .mine()
        .pipe(catchError(() => of({ data: { items: [] } } as any))),
    }).subscribe({
      next: ({ pets, myReports }) => {
        // Una mascota con reporte de pérdida activo (PUBLISHED) no se puede
        // volver a reportar hasta que aparezca: se muestra en el select pero
        // deshabilitada, con su aviso debajo.
        const activePetIds = new Set(
          (myReports.data.items ?? [])
            .filter((r: any) => r.status === 'PUBLISHED')
            .map((r: any) => r.pet_id),
        );
        const all = pets.data.items;
        this.petOptions.set(
          all.map((p: any) => ({
            value: p.id,
            label: activePetIds.has(p.id) ? `${p.name} (reporte de pérdida activo)` : p.name,
            disabled: activePetIds.has(p.id),
          })),
        );
        this.blockedPetsCount.set(all.filter((p: any) => activePetIds.has(p.id)).length);
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

        // El backend guarda department/city como etiquetas legibles
        // ("Atlántico"), pero el select trabaja con slugs ("atlantico").
        // Hay que resolver el slug correspondiente antes de patchear el form.
        const departmentValue =
          this.findDepartmentValueByLabel(report.department) ?? report.department;

        this.form.patchValue(
          {
            pet_id: report.pet_id,
            title: report.title,
            description: report.description ?? '',
            lost_date: report.lost_date,
            reward: report.reward,
            contact_phone: report.contact_phone ?? '',
            department: departmentValue,
            city: '', // se setea abajo
            address: report.address ?? '',
            latitude: report.latitude,
            longitude: report.longitude,
          },
          { emitEvent: false },
        );

        // Sin disparar valueChanges (evita geocodificar/mover el mapa al cargar).
        this.updateCityOptions(departmentValue);
        const cityValue = this.findCityValueByLabel(departmentValue, report.city) ?? report.city;
        this.form.get('city')?.setValue(cityValue, { emitEvent: false });
        this.loading.set(false);

        this.lostReportsService.listImages(id).subscribe({
          next: (imgRes) => this.existingImages.set(imgRes.data),
          error: () => {},
        });
      },
      error: () => {
        this.generalError.set('No pudimos cargar el reporte.');
        this.loading.set(false);
      },
    });
  }

  /** Busca el slug de departamento cuyo label coincide (case-insensitive)
   * con lo que devolvió el backend. */
  private findDepartmentValueByLabel(label: string): string | null {
    return (
      COLOMBIA_DEPARTMENTS.find((d) => d.label.toLowerCase() === label?.toLowerCase())?.value ??
      null
    );
  }

  /** Busca el slug de ciudad dentro de un departamento ya resuelto. */
  private findCityValueByLabel(departmentValue: string, label: string): string | null {
    return (
      getCitiesByDepartment(departmentValue).find(
        (c) => c.label.toLowerCase() === label?.toLowerCase(),
      )?.value ?? null
    );
  }

  onLocationPicked(location: PickedLocation): void {
    this.form.patchValue({
      latitude: location.lat,
      longitude: location.lng,
      ...(location.address ? { address: location.address } : {}),
    });

    // El punto elegido en el mapa define también el departamento/ciudad:
    // así "última ubicación conocida" y mapa siempre coinciden.
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

  onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.photoError.set('Alguno de los archivos no es una imagen');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.photoError.set('Cada imagen no puede superar los 5MB');
        return;
      }
    }

    this.photoError.set('');
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        this.newPhotos.update((list) => [...list, { file, preview: reader.result as string }]);
      reader.readAsDataURL(file);
    });
  }

  removeNewPhoto(index: number): void {
    this.newPhotos.update((list) => list.filter((_, i) => i !== index));
  }

  removeExistingImage(image: LostReportImageResponse): void {
    const reportId = this.reportId();
    if (!reportId) return;
    this.lostReportsService.deleteImage(reportId, image.id).subscribe({
      next: () =>
        this.existingImages.update((list) => list.filter((i) => i.id !== image.id)),
      error: () => this.photoError.set('No pudimos eliminar la imagen.'),
    });
  }

  /** Sube las fotos nuevas al reporte ya creado/actualizado. La primera
   * (si el reporte aún no tenía imágenes) queda como principal. */
  private uploadNewPhotos(reportId: string): void {
    const photos = this.newPhotos();
    if (photos.length === 0) {
      this.finishSubmit();
      return;
    }

    this.uploadingPhotos.set(true);
    const alreadyHasImages = this.existingImages().length > 0;
    forkJoin(
      photos.map((p, index) =>
        this.lostReportsService
          .uploadImage(reportId, p.file, !alreadyHasImages && index === 0)
          .pipe(catchError(() => of(null))),
      ),
    ).subscribe(() => {
      this.uploadingPhotos.set(false);
      this.finishSubmit();
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
    if (control.errors['max']) return 'Máximo $99.999.999';
    if (control.errors['pattern']) return 'Formato de teléfono inválido';
    if (control.errors['futureDate']) return 'La fecha no puede ser posterior a hoy';
    return 'Valor inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.generalError.set(null);
    this.petIdError.set(null);

    const raw = this.form.getRawValue();

    // Traduce los slugs del select a las etiquetas legibles que espera
    // guardar el backend — mismo criterio que sighting-report.ts.
    const departmentLabel = getDepartmentByValue(raw.department)?.label ?? raw.department;
    const cityLabel = this.cityOptions().find((c) => c.value === raw.city)?.label ?? raw.city;

    const payload: CreateLostReportRequest = {
      pet_id: raw.pet_id,
      title: raw.title,
      description: raw.description || undefined,
      lost_date: raw.lost_date,
      reward: raw.reward ? Number(raw.reward) : undefined,
      contact_phone: raw.contact_phone || undefined,
      country: DEFAULT_COUNTRY,
      department: departmentLabel,
      city: cityLabel,
      address: raw.address,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };

    const id = this.reportId();

    if (this.isEditMode() && id) {
      const { pet_id, country, ...updatePayload } = payload;
      this.lostReportsService.update(id, updatePayload).subscribe({
        next: () => this.uploadNewPhotos(id),
        error: (err) => this.handleSubmitError(err),
      });
    } else {
      this.lostReportsService.create(payload).subscribe({
        next: (response) => this.uploadNewPhotos(response.data.id),
        error: (err) => this.handleSubmitError(err),
      });
    }
  }

  private finishSubmit(): void {
    this.submitting.set(false);
    this.submitted.set(true);
  }

  private handleSubmitError(error: any): void {
    this.submitting.set(false);
    const parsed = parseApiError(error);
    this.generalError.set(parsed.message);
    if (parsed.fieldErrors['pet_id']) {
      this.petIdError.set(parsed.fieldErrors['pet_id']);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/reportes']);
  }
}
