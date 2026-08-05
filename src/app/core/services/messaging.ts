import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AuthService } from './auth';
import { ApiSuccessResponse } from './auth.models';
import {
  AppNotification,
  Conversation,
  MessageItem,
  PagedMessages,
  WsEvent,
} from './messaging.models';
import { TokenStorage } from './token-storage';

const RECONNECT_DELAY_MS = 4000;

/** Estado compartido de mensajería: el widget flotante, la campana de
 * notificaciones y la página de mensajes usan la misma instancia y los
 * mismos signals, por lo que siempre están sincronizados. */
@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl;

  readonly conversations = signal<Conversation[]>([]);
  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = signal(0);
  readonly wsConnected = signal(false);
  readonly loading = signal(false);

  /** Se emite cuando llega un mensaje nuevo por el WebSocket, para que la
   * conversación abierta lo anexe en vivo. */
  readonly onMessage = new Subject<{ conversation_id: string; data: MessageItem }>();

  /** Se emite cuando el otro participante marca como leídos mensajes que
   * enviamos; la UI cambia su estado a "leído" (doble chulito). */
  readonly onMessagesRead = new Subject<{ conversation_id: string; message_ids: string[] }>();

  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  /** Última conversación en vista; se reenvía al servidor al reconectar el
   * WebSocket para que el backend no cree notificaciones mientras el usuario
   * realmente tiene el hilo abierto (si se pierde, llega una notificación que
   * el propio hilo marca leída al instante y el contador parpadea). */
  private viewingConversation: string | null = null;

  // ---------- REST: conversaciones y mensajes ----------

  listConversations(): Observable<ApiSuccessResponse<Conversation[]>> {
    return this.http.get<ApiSuccessResponse<Conversation[]>>(`${this.apiUrl}/conversations`);
  }

  getConversation(conversationId: string): Observable<ApiSuccessResponse<Conversation>> {
    return this.http.get<ApiSuccessResponse<Conversation>>(
      `${this.apiUrl}/conversations/${conversationId}`,
    );
  }

  listMessages(
    conversationId: string,
    page = 1,
    pageSize = 50,
  ): Observable<ApiSuccessResponse<PagedMessages>> {
    return this.http.get<ApiSuccessResponse<PagedMessages>>(
      `${this.apiUrl}/conversations/${conversationId}/messages`,
      { params: { page, page_size: pageSize } },
    );
  }

  sendMessage(
    conversationId: string,
    content: string,
  ): Observable<ApiSuccessResponse<MessageItem>> {
    return this.http.post<ApiSuccessResponse<MessageItem>>(`${this.apiUrl}/messages`, {
      conversation_id: conversationId,
      content,
    });
  }

  markRead(conversationId: string): Observable<ApiSuccessResponse<{ marked: number }>> {
    return this.http.post<ApiSuccessResponse<{ marked: number }>>(
      `${this.apiUrl}/conversations/${conversationId}/read`,
      {},
    );
  }

  openSupport(): Observable<ApiSuccessResponse<Conversation>> {
    return this.http.post<ApiSuccessResponse<Conversation>>(
      `${this.apiUrl}/conversations/support`,
      {},
    );
  }

  openDirect(userId: string): Observable<ApiSuccessResponse<Conversation>> {
    return this.http.post<ApiSuccessResponse<Conversation>>(`${this.apiUrl}/conversations`, {
      user_id: userId,
    });
  }

  // ---------- REST: notificaciones ----------

  listNotifications(
    page = 1,
    pageSize = 30,
  ): Observable<ApiSuccessResponse<{ items: AppNotification[] }>> {
    return this.http.get<ApiSuccessResponse<{ items: AppNotification[] }>>(
      `${this.apiUrl}/notifications`,
      { params: { page, page_size: pageSize } },
    );
  }

  unreadNotifications(): Observable<ApiSuccessResponse<{ unread_count: number }>> {
    return this.http.get<ApiSuccessResponse<{ unread_count: number }>>(
      `${this.apiUrl}/notifications/unread-count`,
    );
  }

  markNotificationRead(
    notificationId: string,
  ): Observable<ApiSuccessResponse<AppNotification>> {
    return this.http.patch<ApiSuccessResponse<AppNotification>>(
      `${this.apiUrl}/notifications/${notificationId}/read`,
      {},
    );
  }

  markAllNotificationsRead(): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${this.apiUrl}/notifications/read-all`, {});
  }

  // ---------- Refresco ----------

  refreshConversations(): void {
    if (!this.auth.isAuthenticated()) return;
    this.loading.set(true);
    this.listConversations().subscribe({
      next: (res) => {
        this.conversations.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  refreshNotifications(): void {
    if (!this.auth.isAuthenticated()) return;
    this.listNotifications().subscribe({
      next: (res) => this.notifications.set(res.data.items),
      error: () => {},
    });
  }

  refreshUnread(): void {
    if (!this.auth.isAuthenticated()) return;
    this.unreadNotifications().subscribe({
      next: (res) => this.unreadCount.set(res.data.unread_count),
      error: () => {},
    });
  }

  refreshAll(): void {
    this.refreshConversations();
    this.refreshNotifications();
    this.refreshUnread();
  }

  /** Anula en vivo el contador de una conversación al abrir su hilo. */
  clearConversationUnread(conversationId: string): void {
    this.conversations.update((list) =>
      list.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c)),
    );
  }

  // ---------- WebSocket ----------

  /** Informa al servidor qué conversación tiene abierta este cliente, para
   * que no cree notificaciones mientras el usuario está dentro del chat. */
  setViewing(conversationId: string | null): void {
    this.viewingConversation = conversationId;
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({ type: 'viewing', conversation_id: conversationId }));
  }

  ensureConnected(): void {
    if (this.socket || !this.auth.isAuthenticated()) return;
    const token = this.tokenStorage.getAccessToken();
    if (!token) return;
    this.connect(token);
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.wsConnected.set(false);
  }

  private connect(token: string): void {
    const base = this.apiUrl.replace(/^http/, 'ws');
    this.socket = new WebSocket(`${base}/ws/messages?token=${encodeURIComponent(token)}`);

    this.socket.onopen = () => {
      this.wsConnected.set(true);
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      this.refreshAll();
      if (this.viewingConversation !== null && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({ type: 'viewing', conversation_id: this.viewingConversation }),
        );
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as WsEvent;
        this.handleWsEvent(payload);
      } catch {
        // Mensaje no JSON: ignorar.
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.wsConnected.set(false);
      this.scheduleReconnect();
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || !this.auth.isAuthenticated()) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.auth.isAuthenticated()) {
        const token = this.tokenStorage.getAccessToken();
        if (token) this.connect(token);
      }
    }, RECONNECT_DELAY_MS);
  }

  private handleWsEvent(event: WsEvent): void {
    switch (event.type) {
      case 'message': {
        const { conversation_id, data } = event;
        if (!conversation_id) return;
        this.onMessage.next({
          conversation_id,
          data: data as unknown as MessageItem,
        });
        this.refreshConversations();
        break;
      }
      case 'conversation_unread': {
        if (!event.conversation_id) return;
        const unread = event.data.unread_count ?? 0;
        this.conversations.update((list) =>
          list.map((c) =>
            c.id === event.conversation_id ? { ...c, unread_count: unread } : c,
          ),
        );
        break;
      }
      case 'notification': {
        this.notifications.update((list) => [
          event.data as unknown as AppNotification,
          ...list,
        ]);
        this.refreshUnread();
        break;
      }
      case 'notification_count': {
        this.unreadCount.set(event.data.unread_count ?? 0);
        break;
      }
      case 'messages_read': {
        if (!event.conversation_id) return;
        this.onMessagesRead.next({
          conversation_id: event.conversation_id,
          message_ids: event.data.message_ids ?? [],
        });
        break;
      }
      default:
        break;
    }
  }
}
