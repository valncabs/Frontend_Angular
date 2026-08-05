import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

import { AuthService } from '../../services/auth';
import { ChatbotService } from '../../services/chatbot';
import { MessagingService } from '../../services/messaging';
import { Conversation, MessageItem } from '../../services/messaging.models';

interface Fuente {
  documento: string;
  pagina: number;
  fragmento: string;
}

interface Mensaje {
  usuario: boolean;
  texto: string;
  fuentes?: Fuente[];
}

type Tab = 'ai' | 'messages';

/** Mensaje del hilo con su estado local de envío (solo aplica a los propios). */
type ThreadMessage = MessageItem & { status?: 'sending' | 'sent' | 'read' };

@Component({
  selector: 'app-messaging-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './messaging-widget.html',
  styleUrl: './messaging-widget.css',
})
export class MessagingWidgetComponent {
  @ViewChild('scrollRef') scrollRef!: ElementRef;
  @ViewChild('threadScrollRef') threadScrollRef!: ElementRef;

  private readonly chatbot = inject(ChatbotService);
  readonly messaging = inject(MessagingService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  abierto = signal(false);
  activeTab = signal<Tab>('ai');

  /** Oculta el widget cuando se está en una página de mensajería. */
  escondido = signal(false);

  readonly conversations = this.messaging.conversations;
  readonly unreadTotal = this.messaging.unreadCount;
  readonly isAuthed = this.auth.isAuthenticated;

  // Chat IA
  pregunta = '';
  cargando = false;
  mensajes: Mensaje[] = [];

  // Mensajes
  thread = signal<{ conversation: Conversation; messages: ThreadMessage[]; loading: boolean } | null>(
    null,
  );
  inputMensaje = '';
  enviando = signal(false);

  /** Refresco en silencio del hilo abierto como respaldo del WebSocket
   * (evita perder mensajes entrantes si un evento en vivo se pierde). */
  private threadRefreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const hidden = this.router.url.includes('/mensajes');
        this.escondido.set(hidden);
        if (hidden && this.thread()) {
          this.thread.set(null);
          this.messaging.setViewing(null);
        }
      });

    this.messaging.onMessage.subscribe(({ conversation_id, data }) => {
      const t = this.thread();
      if (t && t.conversation.id === conversation_id) {
        const msg: ThreadMessage = { ...data, status: data.is_read ? 'read' : 'sent' };
        this.thread.update((cur) =>
          cur ? { ...cur, messages: [...cur.messages, msg] } : cur,
        );
        if (this.abierto()) {
          this.messaging.markRead(conversation_id).subscribe({ error: () => {} });
          this.messaging.refreshNotifications();
        }
        this.scrollThreadToBottom();
      }
    });

    this.messaging.onMessagesRead.subscribe(({ conversation_id, message_ids }) => {
      const t = this.thread();
      if (t && t.conversation.id === conversation_id) {
        const ids = new Set(message_ids);
        this.thread.update((cur) =>
          cur
            ? {
                ...cur,
                messages: cur.messages.map((m) =>
                  ids.has(m.id) ? { ...m, is_read: true, status: 'read' } : m,
                ),
              }
            : cur,
        );
      }
    });

    this.threadRefreshTimer = setInterval(() => this.refreshOpenThread(), 15000);
  }

  /** Refetches el hilo abierto en segundo plano para que los mensajes
   * entrantes aparezcan aunque se pierda un evento del WebSocket. */
  private refreshOpenThread(): void {
    const t = this.thread();
    if (!t || t.loading) return;

    this.messaging.listMessages(t.conversation.id, 1, 50).subscribe({
      next: (res) => {
        const prev = new Map(t.messages.map((m) => [m.id, m]));
        const fetched: ThreadMessage[] = res.data.items.map((m) => ({
          ...m,
          status: m.is_read ? 'read' : 'sent',
        }));
        const newMessages = fetched.filter((m) => !prev.has(m.id));
        if (newMessages.length === 0 && fetched.length === t.messages.length) return;

        this.thread.update((cur) => {
          if (!cur) return cur;
          const merged = fetched.map((m) => {
            const existing = prev.get(m.id);
            if (!existing) return m;
            if (existing.status === 'sending' && existing.id.startsWith('local-')) return existing;
            return { ...existing, is_read: m.is_read, status: m.is_read ? 'read' : existing.status };
          });
          return { ...cur, messages: merged };
        });

        if (newMessages.length > 0 && this.abierto()) {
          this.messaging.markRead(t.conversation.id).subscribe({ error: () => {} });
          this.messaging.refreshNotifications();
          this.scrollThreadToBottom();
        }
      },
      error: () => {},
    });
  }

  // ---------- Apertura / pestañas ----------

  abrirCerrar(): void {
    this.abierto.update((v) => !v);
    if (this.abierto() && this.isAuthed()) {
      this.messaging.ensureConnected();
    } else if (!this.abierto() && this.thread()) {
      this.thread.set(null);
      this.messaging.setViewing(null);
    }
  }

  ngOnDestroy(): void {
    if (this.threadRefreshTimer) {
      clearInterval(this.threadRefreshTimer);
      this.threadRefreshTimer = null;
    }
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    if (tab === 'messages' && this.isAuthed()) {
      this.messaging.ensureConnected();
      this.messaging.refreshConversations();
    }
  }

  // ---------- Chat IA ----------

  enviarPregunta(): void {
    if (!this.pregunta.trim()) return;

    const texto = this.pregunta.trim();
    this.mensajes.push({ usuario: true, texto });
    this.pregunta = '';
    this.cargando = true;

    this.chatbot.ask(texto).subscribe({
      next: (resp) => {
        this.cargando = false;
        this.mensajes.push({ usuario: false, texto: resp.answer });
        this.scrollAiToBottom();
      },
      error: () => {
        this.cargando = false;
        this.mensajes.push({
          usuario: false,
          texto: 'Lo siento, ocurrió un error al conectar con Pet AI.',
        });
        this.scrollAiToBottom();
      },
    });
  }

  // ---------- Mensajes ----------

  abrirConversacion(conversation: Conversation): void {
    this.thread.set({ conversation, messages: [], loading: true });
    this.messaging.setViewing(conversation.id);
    this.messaging.listMessages(conversation.id, 1, 50).subscribe({
      next: (res) => {
        const messages: ThreadMessage[] = res.data.items.map((m) => ({
          ...m,
          status: m.is_read ? 'read' : 'sent',
        }));
        this.thread.set({ conversation, messages, loading: false });
        this.messaging.markRead(conversation.id).subscribe({ error: () => {} });
        this.messaging.refreshNotifications();
        this.messaging.clearConversationUnread(conversation.id);
        this.scrollThreadToBottom();
      },
      error: () => {
        this.thread.update((cur) => (cur ? { ...cur, loading: false } : cur));
      },
    });
  }

  volverALista(): void {
    this.thread.set(null);
    this.messaging.setViewing(null);
    this.messaging.refreshConversations();
  }

  enviarMensaje(): void {
    const t = this.thread();
    const texto = this.inputMensaje.trim();
    const user = this.auth.currentUser();
    if (!t || !texto || !user || this.enviando()) return;

    const tmp: ThreadMessage = {
      id: `local-${Date.now()}`,
      conversation_id: t.conversation.id,
      sender_user_id: user.id,
      content: texto,
      is_read: false,
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    this.thread.update((cur) =>
      cur ? { ...cur, messages: [...cur.messages, tmp] } : cur,
    );
    this.inputMensaje = '';
    this.enviando.set(true);
    this.scrollThreadToBottom();

    this.messaging.sendMessage(t.conversation.id, texto).subscribe({
      next: (res) => {
        this.enviando.set(false);
        this.thread.update((cur) =>
          cur
            ? {
                ...cur,
                messages: cur.messages.map((m) =>
                  m.id === tmp.id ? { ...res.data, status: 'sent' } : m,
                ),
              }
            : cur,
        );
        this.scrollThreadToBottom();
      },
      error: () => {
        this.enviando.set(false);
        this.thread.update((cur) =>
          cur
            ? { ...cur, messages: cur.messages.filter((m) => m.id !== tmp.id) }
            : cur,
        );
        this.inputMensaje = texto;
      },
    });
  }

  contactarSoporte(): void {
    if (!this.isAuthed()) return;
    this.messaging.openSupport().subscribe({
      next: (res) => {
        this.messaging.refreshConversations();
        this.abrirConversacion(res.data);
      },
      error: () => {},
    });
  }

  irAMensajes(): void {
    this.abierto.set(false);
    const esAdmin = this.auth.currentUser()?.roles.includes('ADMIN');
    this.router.navigate([esAdmin ? '/admin/mensajes' : '/dashboard/mensajes']);
  }

  irALogin(): void {
    this.abierto.set(false);
    this.router.navigate(['/login']);
  }

  // ---------- Utilidades ----------

  formatoFecha(iso: string | null | undefined): string {
    if (!iso) return '';
    const date = new Date(iso);
    const hoy = new Date();
    const esHoy = date.toDateString() === hoy.toDateString();
    if (esHoy) {
      return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  }

  private scrollAiToBottom(): void {
    setTimeout(() => {
      if (this.scrollRef?.nativeElement) {
        this.scrollRef.nativeElement.scrollTop = this.scrollRef.nativeElement.scrollHeight;
      }
    });
  }

  private scrollThreadToBottom(): void {
    setTimeout(() => {
      if (this.threadScrollRef?.nativeElement) {
        this.threadScrollRef.nativeElement.scrollTop =
          this.threadScrollRef.nativeElement.scrollHeight;
      }
    });
  }
}
