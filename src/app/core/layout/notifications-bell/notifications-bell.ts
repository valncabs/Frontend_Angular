import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { AuthService } from '../../services/auth';
import { MessagingService } from '../../services/messaging';
import { AppNotification } from '../../services/messaging.models';

@Component({
  selector: 'app-notifications-bell',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications-bell.html',
  styleUrl: './notifications-bell.css',
})
export class NotificationsBellComponent {
  readonly messaging = inject(MessagingService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly element = inject(ElementRef);

  open = false;

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.messaging.ensureConnected();
      this.messaging.refreshUnread();
      this.messaging.refreshNotifications();
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null): void {
    if (this.open && target instanceof HTMLElement && !this.element.nativeElement.contains(target)) {
      this.open = false;
    }
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.messaging.refreshNotifications();
    }
  }

  marcarLeida(notification: AppNotification): void {
    if (notification.is_read) return;
    this.messaging.markNotificationRead(notification.id).subscribe({
      next: () => {
        this.messaging.refreshUnread();
        this.messaging.notifications.update((list) =>
          list.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
        );
      },
      error: () => {},
    });
  }

  marcarTodas(): void {
    this.messaging.markAllNotificationsRead().subscribe({
      next: () => {
        this.messaging.refreshUnread();
        this.messaging.notifications.update((list) => list.map((n) => ({ ...n, is_read: true })));
      },
      error: () => {},
    });
  }

  irAMensajes(): void {
    this.open = false;
    this.router.navigate([this.rutaMensajes()]);
  }

  abrirNotificacion(notification: AppNotification): void {
    this.open = false;
    if (!notification.is_read) {
      this.messaging.markNotificationRead(notification.id).subscribe({
        next: () => this.messaging.refreshUnread(),
        error: () => {},
      });
    }

    // Avistamiento nuevo sobre un reporte perdido propio: lleva a "Mis
    // reportes" y abre el modal de avistamientos del reporte.
    if (
      notification.type === 'FOUND_MATCH' &&
      notification.lost_report_id &&
      !this.auth.currentUser()?.roles.includes('ADMIN')
    ) {
      this.router.navigate(['/dashboard/reportes'], {
        queryParams: { tab: 'MINE', report: notification.lost_report_id },
      });
      return;
    }

    const conversationId = notification.conversation_id;
    if (conversationId) {
      this.router.navigate([this.rutaMensajes()], {
        queryParams: { conversation: conversationId },
      });
    } else {
      this.router.navigate([this.rutaMensajes()]);
    }
  }

  private rutaMensajes(): string {
    return this.auth.currentUser()?.roles.includes('ADMIN')
      ? '/admin/mensajes'
      : '/dashboard/mensajes';
  }

  formatoFecha(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
