import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { PetInputComponent } from '../../../../shared/components/pet-input/pet-input';
import { PetSelectComponent, SelectOption } from '../../../pets/components/select-pets/select-pets';
import { PetButtonComponent } from '../../../../shared/components/button-pets/button-pets';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer';
import {
  LocationPickerComponent,
  PickedLocation,
} from '../../../../shared/components/location-picker/location-picker';
import { FoundReportsService } from '../../../reports/data-access/found-reports';
import { LostReportsService } from '../../../reports/data-access/lost-reports';
import { CatalogService } from '../../../../core/services/catalog';
import { parseApiError } from '../../../../core/services/api-error';
import { SpeciesResponse } from '../../../pets/data-access/pet.models';
import { LostReportResponse } from '../../../reports/data-access/lost-report-models';

import {
  COLOMBIA_DEPARTMENTS,
  DEFAULT_COUNTRY,
  getDepartmentByValue,
  getCitiesByDepartment,
} from '../../../../core/services/colombia-locations';

/** La fecha de encuentro no puede ser posterior a hoy. */
function noFutureDate(control: AbstractControl): { futureDate: true } | null {
  if (!control.value) return null;
  const value = new Date(`${control.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return value > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-sighting-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    PetInputComponent,
    PetSelectComponent,
    PetButtonComponent,
    LocationPickerComponent,
    ImageViewerComponent,
  ],
  templateUrl: './sighting-report.html',
})
export class SightingReportComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private foundReportsService = inject(FoundReportsService);
  private lostReportsService = inject(LostReportsService);
  private catalogService = inject(CatalogService);

  form!: FormGroup;
  submitting = signal(false);
  submitted = signal(false);
  generalError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});

  species = signal<SpeciesResponse[]>([]);

  /** Si viene de "Yo lo vi" sobre un reporte de pérdida específico, este id
   * vincula el avistamiento con ese lost_report para notificar al dueño. */
  private lostReportId: string | null = null;
  petContext = signal<LostReportResponse | null>(null);
  petContextImages = signal<string[]>([]);
  loadingPetContext = signal(false);

  /** Expande/colapsa la información completa del contexto de la mascota. */
  contextExpanded = signal(false);
  /** Visor a pantalla completa para las imágenes del reporte original. */
  petImageOpen = signal(false);
  selectedPetImage = signal<string | null>(null);

  photoPreview = signal<string | null>(null);
  photoError = '';
  private selectedPhoto: File | null = null;

  readonly sexLabel: Record<string, string> = {
    MALE: 'Macho',
    FEMALE: 'Hembra',
    UNKNOWN: 'No especificado',
  };
  readonly sizeLabel: Record<string, string> = {
    SMALL: 'Pequeño',
    MEDIUM: 'Mediano',
    LARGE: 'Grande',
  };

  get speciesOptions(): SelectOption[] {
    return [
      { value: '', label: 'Selecciona una especie' },
      ...this.species().map((s) => ({ value: s.id, label: s.name })),
    ];
  }

  readonly departmentOptions: SelectOption[] = COLOMBIA_DEPARTMENTS.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  cityOptions = signal<SelectOption[]>([]);

  ngOnInit(): void {
    this.buildForm();
    this.lostReportId = this.route.snapshot.queryParamMap.get('lostReportId');

    this.catalogService.listSpecies().subscribe({
      next: (response) => this.species.set(response.data),
      error: () => {},
    });

    if (this.lostReportId) {
      this.loadPetContext(this.lostReportId);
    }
  }

  private loadPetContext(lostReportId: string): void {
    this.loadingPetContext.set(true);
    this.lostReportsService.getById(lostReportId).subscribe({
      next: (response) => {
        this.petContext.set(response.data);
        // Especie ya conocida: precarga el campo y lo bloquea implícitamente
        // (el usuario está reportando la misma especie que se perdió).
        this.form.patchValue({ species_id: response.data.pet_species_id });
        this.loadingPetContext.set(false);
      },
      error: () => this.loadingPetContext.set(false),
    });

    this.lostReportsService.listImages(lostReportId).subscribe({
      next: (response) => {
        this.petContextImages.set(
          response.data.map((img) => img.url).filter((url): url is string => !!url),
        );
      },
      error: () => {},
    });
  }

  speciesName(speciesId: string): string {
    return this.species().find((s) => s.id === speciesId)?.name ?? '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  openPetImage(url: string): void {
    this.selectedPetImage.set(url);
    this.petImageOpen.set(true);
  }

  private buildForm(): void {
    this.form = this.fb.group({
      species_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      sightingDate: ['', [Validators.required, noFutureDate]],
      contactPhone: ['', [Validators.pattern(/^[0-9\s+-]{7,15}$/)]],
      department: ['', Validators.required],
      city: ['', Validators.required],
      address: [{ value: '', disabled: true }, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });

    this.form.get('department')?.valueChanges.subscribe((deptValue: string) => {
      this.updateCityOptions(deptValue);
      this.form.get('city')?.setValue('', { emitEvent: false });
      this.clearMapSelection();
    });

    // Elegir una ciudad mueve el mapa a esa ciudad para que la ubicación
    // reportada y lo que muestra el mapa siempre coincidan.
    this.form.get('city')?.valueChanges.subscribe((cityValue: string) => {
      this.focusMapOnCity(cityValue);
    });
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
    const dept = getDepartmentByValue(this.form.get('department')?.value);
    const city = this.cityOptions().find((c) => c.value === cityValue);
    if (!dept || !city) return;

    this.form.patchValue(
      { latitude: null, longitude: null, address: '' },
      { emitEvent: false },
    );
    this.picker?.centerOn(city.label, dept.label);
  }

  /** Recibe la ubicación elegida en app-location-picker (click en mapa,
   * arrastre del marcador, resultado de búsqueda o "mi ubicación"). */
  onLocationPicked(location: PickedLocation): void {
    this.form.patchValue({
      latitude: location.lat,
      longitude: location.lng,
      ...(location.address ? { address: location.address } : {}),
    });

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

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.photoError = 'El archivo debe ser una imagen';
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.photoError = 'La imagen no puede superar los 5MB';
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

  hasError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return this.fieldErrors()[field] ?? '';
    if (c.errors['required']) return 'Este campo es obligatorio';
    if (c.errors['maxlength']) return 'Máximo de caracteres excedido';
    if (c.errors['pattern']) return 'Formato de teléfono inválido';
    if (c.errors['futureDate']) return 'La fecha no puede ser posterior a hoy';
    return 'Valor inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.generalError.set(null);
    this.fieldErrors.set({});

    const raw = this.form.getRawValue();
    const departmentLabel = getDepartmentByValue(raw.department)?.label ?? raw.department;
    const cityLabel = this.cityOptions().find((c) => c.value === raw.city)?.label ?? raw.city;

    const payload = {
      species_id: raw.species_id,
      lost_report_id: this.lostReportId,
      title: raw.title,
      description: raw.description,
      found_date: raw.sightingDate,
      contact_phone: raw.contactPhone || null,
      country: DEFAULT_COUNTRY,
      department: departmentLabel,
      city: cityLabel,
      address: raw.address,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };

    this.foundReportsService.create(payload).subscribe({
      next: (response) => {
        if (this.selectedPhoto) {
          this.foundReportsService
            .uploadImage(response.data.id, this.selectedPhoto, true)
            .subscribe({
              next: () => {
                this.submitting.set(false);
                this.submitted.set(true);
              },
              // Si la mascota se guardó pero la imagen falló, igual mostramos éxito:
              // el reporte ya existe, la foto es complementaria.
              error: () => {
                this.submitting.set(false);
                this.submitted.set(true);
              },
            });
        } else {
          this.submitting.set(false);
          this.submitted.set(true);
        }
      },
      error: (error) => {
        this.submitting.set(false);
        const parsed = parseApiError(error);
        this.generalError.set(parsed.message);
        this.fieldErrors.set(parsed.fieldErrors);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/reportes']);
  }
}
