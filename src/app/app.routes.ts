import { Routes } from '@angular/router';

import { HomePage } from './features/home/page/home-page/home-page';

import { LoginPage } from './features/auth/page/login-page/login-page';
import { RegisterPage } from './features/auth/page/register-page/register-page';

import { DashPage } from './features/dash/page/dash-page/dash-page';
import { MyPets } from './features/dash/page/my-pets-page/my-pets-page';
import { PetReportsComponent } from './features/dash/page/pet-reports/pet-reports';
import { SightingReportComponent } from './features/dash/page/sighting-report/sighting-report';
import { PageConfiguration } from './features/dash/page/page-configuration/page-configuration';

import { AdminPage } from './features/admin/page/admin-page/admin-page';
import { AdminReportesPage } from './features/admin/page/admin-reportes-page/admin-reportes-page';
import { AdminPanelPage } from './features/admin/page/admin-panel-page/admin-panel-page';
import { PowerBI } from './features/admin/page/power-bi/power-bi';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: HomePage,
    title: 'Pet-Centric'
  },

  {
    path: 'login',
    component: LoginPage,
    title: 'Iniciar sesión'
  },

  {
    path: 'registro',
    component: RegisterPage,
    title: 'Crear cuenta'
  },

  {
    path: 'dashboard',
    component: DashPage,
    children: [

      {
        path: '',
        redirectTo: 'mascotas',
        pathMatch: 'full'
      },

      {
        path: 'mascotas',
        component: MyPets
      },

      {
        path: 'reportes',
        component: PetReportsComponent
      },

      {
        path: 'reportar-avistamiento',
        component: SightingReportComponent
      },

      {
        path: 'configuracion',
        component: PageConfiguration
      }

    ]
  },

  {
    path: 'admin',
    component: AdminPage,
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: AdminReportesPage
      },

      {
        path: 'panel',
        component: AdminPanelPage
      },

      {
        path: 'powerbi',
        component: PowerBI
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];