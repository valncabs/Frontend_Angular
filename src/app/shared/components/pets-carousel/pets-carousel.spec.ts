import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsCarousel } from './pets-carousel';

describe('PetsCarousel', () => {
  let component: PetsCarousel;
  let fixture: ComponentFixture<PetsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsCarousel],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
