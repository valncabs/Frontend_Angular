import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

import { ChatbotComponent } from '../app/shared/components/chatbot/chatbot'; // o chatbot.component

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    ChatbotComponent
  ],
  templateUrl: './app.html',
})
export class App {

  protected readonly window = window;
  protected auth = inject(AuthService);

  constructor() {

    this.auth.isLoading$.subscribe(l =>
      console.log('APP isLoading:', l)
    );

    this.auth.isAuthenticated$.subscribe(a =>
      console.log('APP isAuthenticated:', a)
    );

  }

}