import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AdminNavComponent } from '../../components/admin-nav/admin-nav';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNavComponent],
  templateUrl: './admin-page.html',
})
export class AdminPage {}
