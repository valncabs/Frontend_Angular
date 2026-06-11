import { Component } from '@angular/core';

import { Header } from '../../../../shared/components/header/header'; //<<<---
import { Nav } from '../../../../shared/components/nav/nav'; //<<<---
import { Footer } from '../../../../shared/components/footer/footer'; //<<<---

@Component({
  selector: 'app-principal-page',
  imports: [ Header, Nav, Footer],
  templateUrl: './principal-page.html',

})
export class PrincipalPage {}
