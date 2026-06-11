import { Component } from '@angular/core';
import { NavComponent } from '../../../../shared/components/nav/nav';
import { HeroComponent } from '../../../../shared/components/hero/hero';

@Component({
  selector: 'app-home-page',
  imports: [NavComponent, HeroComponent],
  templateUrl: './home-page.html',

})
export class HomePage {}
