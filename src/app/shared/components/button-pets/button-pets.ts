import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-pet-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-pets.html',
})
export class PetButtonComponent {
  @Input() label = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;
  @Input() icon?: string;

  @Output() clicked = new EventEmitter<void>();

  get classes(): string {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3 text-base',
    };

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white focus:ring-[var(--primary)]',
      secondary:
        'bg-[var(--secondary)] hover:brightness-95 text-white focus:ring-[var(--secondary)]',
      danger: 'bg-[var(--danger)] hover:brightness-90 text-white focus:ring-[var(--danger)]',
      outline:
        'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white focus:ring-[var(--primary)]',
    };

    const width = this.fullWidth ? 'w-full' : '';

    return `${base} ${sizes[this.size]} ${variants[this.variant]} ${width}`;
  }

  handleClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
