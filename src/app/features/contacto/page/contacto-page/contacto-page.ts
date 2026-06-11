import { Component } from '@angular/core';
import { Header } from '../../../../shared/components/header/header'; //<<<---
import { Nav } from '../../../../shared/components/nav/nav'; //<<<---
import { Footer } from '../../../../shared/components/footer/footer'; //<<<---

@Component({
  selector: 'app-contacto-page',
  imports: [ Header, Nav, Footer],
  templateUrl: './contacto-page.html',

})
export class ContactoPage {}
