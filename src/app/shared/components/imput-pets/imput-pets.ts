import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type InputType = 'text' | 'number' | 'email' | 'password' | 'textarea';

@Component({
  selector: 'app-pet-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './imput-pets.html',
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
  @Input() type: InputType = 'text';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() hasError = false;
  @Input() rows = 3;

  value = signal<string | number>('');
  isDisabled = signal(false);
  isTouched = signal(false);

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

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const val = this.type === 'number' ? Number(target.value) : target.value;
    this.value.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }

  get baseInputClasses(): string {
    const base =
      'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all duration-200 focus:outline-none focus:ring-2';
    const error = this.hasError
      ? 'border-[var(--danger)] focus:ring-[var(--danger)]/30'
      : 'border-gray-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20';
    const disabled = this.isDisabled() ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';
    return `${base} ${error} ${disabled}`;
  }
}
