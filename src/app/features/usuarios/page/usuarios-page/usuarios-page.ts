import { Component, inject } from '@angular/core'; //<<<-----
import { UsuariosService } from "../../services/usuarios"; //<<<-----
import { Header } from '../../../../shared/components/header/header'; //<<<-----
import { Nav } from '../../../../shared/components/nav/nav'; //<<<-----
import { Footer } from '../../../../shared/components/footer/footer'; //<<<-----

@Component({
  selector: 'app-usuarios-page',
  imports: [ Header, Nav, Footer],
  templateUrl: './usuarios-page.html',

})
export class UsuariosPage {
  // Inyectamos el servicio
  usuariosService = inject(UsuariosService);
}
