import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MessagingWidgetComponent } from './core/layout/messaging-widget/messaging-widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MessagingWidgetComponent],
  templateUrl: './app.html',
})
export class App {}
