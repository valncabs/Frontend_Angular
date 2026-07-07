import { Component } from '@angular/core';
import { NavComponent } from '../../components/nav/nav';
import { HeroComponent } from '../../components/hero/hero';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { AuthService } from '@auth0/auth0-angular';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [NavComponent, HeroComponent, FooterComponent],
  templateUrl: './home-page.html',
})
export class HomePage {
  auth = inject(AuthService);

  login() {
    this.auth.loginWithRedirect();
  }
}
