import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild, computed, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AdminUsersService } from '../../../admin/data-access/admin-users';
import { AdminUserListItem } from '../../../admin/data-access/admin-users.models';
import { AuthService } from '../../../../core/services/auth';
import { MessagingService } from '../../../../core/services/messaging';
import { Conversation, MessageItem } from '../../../../core/services/messaging.models';
import { ModalComponent } from '../../../../shared/components/modal/modal';

type ThreadMessage = MessageItem & { status?: 'sending' | 'sent' | 'read' };

@Component({
  selector: 'app-messaging-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent],
  templateUrl: './messaging-page.html',
  styleUrl: './messaging-page.css',
})
export class MessagingPageComponent {
  readonly messaging = inject(MessagingService);
  readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly adminUsers = inject(AdminUsersService);
  private readonly route = inject(ActivatedRoute);
  readonly conversations = this.messaging.conversations;

  readonly esAdmin = computed(() => this.auth.currentUser()?.roles.includes('ADMIN') ?? false);

  /** Refresca en silencio el hilo abierto como respaldo del WebSocket: si
   * algún evento en vivo se pierde (socket caído, token renovado, carrera de
   * carga), los mensajes entrantes aparecen igual sin salir del chat. */
  private threadRefreshTimer: ReturnType<typeof setInterval> | null = null;

  selected = signal<Conversation | null>(null);
  messages = signal<ThreadMessage[]>([]);
  loading = signal(false);
  enviando = signal(false);
  inputMensaje = '';

  // Selector de usuario (solo admin)
  selectorAbierto = signal(false);
  busquedaUsuario = '';
  resultadosUsuarios = signal<AdminUserListItem[]>([]);
  buscandoUsuarios = signal(false);

  @ViewChild('threadScroll') threadScroll!: ElementRef;

  constructor() {
    this.messaging.ensureConnected();
    this.messaging.refreshConversations();

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const conversationId = params['conversation'];
      if (conversationId) {
        this.messaging.getConversation(conversationId).subscribe({
          next: (res) => this.select(res.data),
          error: () => {},
        });
      }
    });

    this.messaging.onMessage
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ conversation_id, data }) => {
        if (this.selected()?.id === conversation_id) {
          const msg: ThreadMessage = { ...data, status: data.is_read ? 'read' : 'sent' };
          this.messages.update((list) => [...list, msg]);
          if (document.visibilityState === 'visible') {
            this.messaging.markRead(conversation_id).subscribe({ error: () => {} });
            this.messaging.refreshNotifications();
          }
          this.scrollBottom();
        }
        this.messaging.refreshConversations();
      });

    this.messaging.onMessagesRead
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ conversation_id, message_ids }) => {
        if (this.selected()?.id !== conversation_id) return;
        const ids = new Set(message_ids);
        this.messages.update((list) =>
          list.map((m) => (ids.has(m.id) ? { ...m, is_read: true, status: 'read' } : m)),
        );
      });

    this.threadRefreshTimer = setInterval(() => this.refreshOpenThread(), 15000);
  }

  select(conversation: Conversation): void {
    this.selected.set(conversation);
    this.messaging.setViewing(conversation.id);
    this.loading.set(true);
    this.messages.set([]);

    this.messaging.listMessages(conversation.id, 1, 50).subscribe({
      next: (res) => {
        const items: ThreadMessage[] = res.data.items.map((m) => ({
          ...m,
          status: m.is_read ? 'read' : 'sent',
        }));
        // No descartar mensajes que llegaron en vivo mientras se cargaba la
        // lista (carrera entre el WebSocket y el primer fetch).
        const fetchedIds = new Set(items.map((m) => m.id));
        const arrived = this.messages().filter((m) => !fetchedIds.has(m.id));
        this.messages.set([...items, ...arrived]);
        this.loading.set(false);
        this.messaging.markRead(conversation.id).subscribe({ error: () => {} });
        this.messaging.refreshNotifications();
        this.messaging.clearConversationUnread(conversation.id);
        this.scrollBottom();
      },
      error: () => this.loading.set(false),
    });
  }

  ngOnDestroy(): void {
    if (this.threadRefreshTimer) {
      clearInterval(this.threadRefreshTimer);
      this.threadRefreshTimer = null;
    }
    this.messaging.setViewing(null);
  }

  /** Refetches el hilo abierto y lo reemplaza sin tocar estados locales que
   * ya se conozcan (status de envío/lectura), de forma silenciosa. */
  private refreshOpenThread(): void {
    const conv = this.selected();
    if (!conv || this.loading()) return;

    this.messaging.listMessages(conv.id, 1, 50).subscribe({
      next: (res) => {
        const prev = new Map(this.messages().map((m) => [m.id, m]));
        const fetched: ThreadMessage[] = res.data.items.map((m) => ({
          ...m,
          status: m.is_read ? 'read' : 'sent',
        }));
        const newMessages = fetched.filter((m) => !prev.has(m.id));
        if (newMessages.length === 0 && fetched.length === this.messages().length) return;

        this.messages.update((current) => {
          const merged = fetched.map((m) => {
            const existing = prev.get(m.id);
            if (!existing) return m;
            if (existing.status === 'sending' && existing.id.startsWith('local-')) return existing;
            return { ...existing, is_read: m.is_read, status: m.is_read ? 'read' : existing.status };
          });
          return merged;
        });

        if (newMessages.length > 0 && document.visibilityState === 'visible') {
          this.messaging.markRead(conv.id).subscribe({ error: () => {} });
          this.scrollBottom();
        }
      },
      error: () => {},
    });
  }

  enviar(): void {
    const conv = this.selected();
    const texto = this.inputMensaje.trim();
    const user = this.auth.currentUser();
    if (!conv || !texto || !user || this.enviando()) return;

    const tmp: ThreadMessage = {
      id: `local-${Date.now()}`,
      conversation_id: conv.id,
      sender_user_id: user.id,
      content: texto,
      is_read: false,
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    this.messages.update((list) => [...list, tmp]);
    this.inputMensaje = '';
    this.enviando.set(true);
    this.scrollBottom();

    this.messaging.sendMessage(conv.id, texto).subscribe({
      next: (res) => {
        this.enviando.set(false);
        this.messages.update((list) =>
          list.map((m) => (m.id === tmp.id ? { ...res.data, status: 'sent' } : m)),
        );
        this.scrollBottom();
      },
      error: () => {
        this.enviando.set(false);
        this.messages.update((list) => list.filter((m) => m.id !== tmp.id));
        this.inputMensaje = texto;
      },
    });
  }

  contactarSoporte(): void {
    this.messaging.openSupport().subscribe({
      next: (res) => {
        this.messaging.refreshConversations();
        this.select(res.data);
      },
      error: () => {},
    });
  }

  // ---------- Selector de usuario (admin) ----------

  abrirSelector(): void {
    this.selectorAbierto.set(true);
    this.busquedaUsuario = '';
    this.resultadosUsuarios.set([]);
    this.buscarUsuarios();
  }

  cerrarSelector(): void {
    this.selectorAbierto.set(false);
  }

  buscarUsuarios(): void {
    this.buscandoUsuarios.set(true);
    this.adminUsers.list({ search: this.busquedaUsuario || undefined, pageSize: 15 }).subscribe({
      next: (res) => {
        this.resultadosUsuarios.set(res.data.items);
        this.buscandoUsuarios.set(false);
      },
      error: () => this.buscandoUsuarios.set(false),
    });
  }

  iniciarConUsuario(user: AdminUserListItem): void {
    this.selectorAbierto.set(false);
    this.messaging.openDirect(user.id).subscribe({
      next: (res) => {
        this.messaging.refreshConversations();
        this.select(res.data);
      },
      error: () => {},
    });
  }

  // ---------- Utilidades ----------

  nombreUsuario(user: AdminUserListItem): string {
    if (user.first_name || user.last_name) {
      return `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    }
    return user.email;
  }

  formatoFecha(iso: string | null | undefined): string {
    if (!iso) return '';
    const date = new Date(iso);
    const hoy = new Date();
    if (date.toDateString() === hoy.toDateString()) {
      return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  }

  formatoFechaCompleta(iso: string | null | undefined): string {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private scrollBottom(): void {
    setTimeout(() => {
      if (this.threadScroll?.nativeElement) {
        this.threadScroll.nativeElement.scrollTop = this.threadScroll.nativeElement.scrollHeight;
      }
    });
  }
}
