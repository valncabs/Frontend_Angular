import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { AuthLayoutComponent } from '../../../auth/components/auth-layaut/auth-layaut';
import { AuthCard } from '../../../auth/components/auth-card/auth-card';
import { AuthService } from '../../../../core/services/auth';

type VerifyState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, AuthLayoutComponent, AuthCard],
  templateUrl: './verify-email-page.html',
})
export class VerifyEmailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly state = signal<VerifyState>('loading');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state.set('error');
      return;
    }

    this.authService.verifyEmail({ token }).subscribe({
      next: () => this.state.set('success'),
      error: () => this.state.set('error'),
    });
  }
}