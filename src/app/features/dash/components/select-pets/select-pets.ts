import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-pet-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-pets.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PetSelectComponent),
      multi: true,
    },
  ],
})
export class PetSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Selecciona una opción';
  @Input() options: SelectOption[] = [];
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() hasError = false;

  value = signal<string | number>('');
  isDisabled = signal(false);

  private onChange: (val: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string | number): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (val: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
  }

  isOptionSelected(optValue: string | number): boolean {
    return String(optValue) === String(this.value());
  }

  get selectClasses(): string {
    const base =
      'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] transition-all duration-200 focus:outline-none focus:ring-2 appearance-none cursor-pointer';
    const error = this.hasError
      ? 'border-[var(--danger)] focus:ring-[var(--danger)]/30'
      : 'border-gray-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20';
    const disabled = this.isDisabled() ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';
    const empty = !this.value() ? 'text-[var(--text-secondary)]' : '';
    return `${base} ${error} ${disabled} ${empty}`;
  }
}
