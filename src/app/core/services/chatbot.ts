import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fuente {
  documento: string;

  pagina: number;

  fragmento: string;
}

export interface ChatResponse {
  answer: string;

  sources: Fuente[];
}

/* ===========================
   Servicio
=========================== */

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly api = 'https://rag-neww.onrender.com/ask';

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.api, {
      question,
    });
  }
}
