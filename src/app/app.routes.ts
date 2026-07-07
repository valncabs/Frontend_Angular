import { Routes } from '@angular/router';
import { HomePage } from './features/home/page/home-page/home-page';
import { AdminPage } from './features/admin/page/admin-page/admin-page';
import { PageConfiguration } from './features/dash/page/page-configuration/page-configuration';
import { PageMyProfile } from './features/dash/page/page-my-profile/page-my-profile';

import { DashPage } from './features/dash/page/dash-page/dash-page';
import { MyPets } from './features/dash/page/my-pets-page/my-pets-page';
import { PetReportsComponent } from './features/dash/page/pet-reports/pet-reports';
import { SightingReportComponent } from './features/dash/page/sighting-report/sighting-report';
import { PowerBI } from './features/admin/page/power-bi/power-bi';
import { AdminPanelPage } from './features/admin/page/admin-panel-page/admin-panel-page';
import { AdminReportesPage } from './features/admin/page/admin-reportes-page/admin-reportes-page';
import { InfoPerfilComponent } from './shared/components/info-perfil/info-perfil';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage, title: 'Pet-Centric' },
  { path: 'dashboard', pathMatch: 'full', redirectTo: 'dashboard/mascotas' },

  {
    path: 'dashboard',
    component: DashPage,

    title: 'Dashboard | Pet-Centric',
    children: [
      { path: '', redirectTo: 'mascotas', pathMatch: 'full' },
      { path: 'mascotas', component: MyPets, title: 'Mis Mascotas | Pet-Centric' },
      { path: 'reportes', component: PetReportsComponent, title: 'Reportes | Pet-Centric' },
      { path: 'reportar-avistamiento', component: SightingReportComponent, title: 'Reportar Avistamiento | Pet-Centric' },
      { path: 'mi-perfil', component: PageMyProfile, title: 'Mi Perfil | Pet-Centric' },
      { path: 'configuracion', component: PageConfiguration, title: 'Configuración | Pet-Centric' },
    ]
  },

  {
    path: 'admin',
    component: AdminPage,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminReportesPage },
      { path: 'powerbi', component: PowerBI },
      { path: 'perfil', component: InfoPerfilComponent, title: 'Perfil | Pet-Centric Admin' },
    ]
  },

  { path: '**', redirectTo: 'home' },
];