export interface ConversationParticipant {
  id: string;
  full_name: string;
  email: string;
  photo_url: string | null;
}

export interface MessageItem {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant: ConversationParticipant | null;
  last_message: MessageItem | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface PagedMessages {
  items: MessageItem[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}

export interface PagedNotifications {
  items: AppNotification[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  conversation_id?: string | null;
  lost_report_id?: string | null;
  created_at: string;
}

/** Eventos que empuja el servidor por el WebSocket. */
export interface WsEvent {
  type:
    | 'message'
    | 'conversation_unread'
    | 'notification'
    | 'notification_count'
    | 'messages_read'
    | 'ping';
  conversation_id?: string;
  data: {
    unread_count?: number;
    message_ids?: string[];
    [key: string]: unknown;
  };
}
