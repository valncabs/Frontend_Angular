import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavDashboardComponent } from '../../components/nav-dashboard/nav-dashboard';

@Component({
  selector: 'app-dash-page',
  standalone: true,
  imports: [NavDashboardComponent, RouterOutlet],
  templateUrl: './dash-page.html',
})
export class DashPage {}
