import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type PetInputType = 'text' | 'number' | 'email' | 'tel' | 'textarea';

@Component({
  selector: 'app-pet-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pet-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PetInputComponent),
      multi: true,
    },
  ],
})
export class PetInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: PetInputType = 'text';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() hasError = false;
  @Input() rows = 3;

  value = signal<string | number>('');
  isDisabled = signal(false);

  private onChange: (val: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string | number | null): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (val: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const raw = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    // Para inputs numéricos, propagamos null en vacío (no '' ni NaN) para
    // que el backend reciba `null` limpio en campos opcionales como weight.
    const val = this.type === 'number' ? (raw === '' ? null : Number(raw)) : raw;
    this.value.set(raw);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }

  get inputClasses(): string {
    const base =
      'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-[var(--text-secondary)]';
    const error = this.hasError
      ? 'border-[var(--danger)] focus:ring-[var(--danger)]/30'
      : 'border-gray-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20';
    const disabled = this.isDisabled() ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';
    return `${base} ${error} ${disabled}`;
  }
}
