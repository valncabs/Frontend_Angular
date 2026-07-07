import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavComponent } from '../../components/nav/nav';
import { HeroComponent } from '../../components/hero/hero';
import { FooterComponent } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavComponent,
    HeroComponent,
    FooterComponent
  ],
  templateUrl: './home-page.html',
})
export class HomePage {

  constructor(private router: Router) {}

  login(): void {
    this.router.navigate(['/login']);
  }

}