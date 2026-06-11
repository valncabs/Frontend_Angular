import { Component } from '@angular/core';
import { NavComponent } from '../../../../shared/components/nav/nav';
import { HeroComponent } from '../../../../shared/components/hero/hero';
import { HowItWorksComponent } from '../../../../shared/components/how-it-works/how-it-works';
import { PetsCarouselComponent } from '../../../../shared/components/pets-carousel/pets-carousel';
import { FaqComponent } from '../../../../shared/components/faq/faq';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { TestimonialsComponent } from '../../../../shared/components/testimonials/testimonials';
import { StatsComponent } from '../../../../shared/components/stats/stats';
@Component({
  selector: 'app-home-page',
  imports: [
    NavComponent,
    HeroComponent,
    HowItWorksComponent,
    PetsCarouselComponent,
    FaqComponent,
    FooterComponent,
    TestimonialsComponent,
    StatsComponent,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
