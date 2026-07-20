import { Routes } from '@angular/router';

import { HomePage } from './features/home/page/home-page/home-page';

import { LoginPage } from './features/auth/page/login-page/login-page';
import { RegisterPage } from './features/auth/page/register-page/register-page';
import { ForgotPasswordPage } from './features/auth/page/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './features/auth/page/reset-password-page/reset-password-page';
import { VerifyEmailPage } from './features/auth/page/verify-email-page/verify-email-page';

import { DashPage } from './features/dash/page/dash-page/dash-page';
import { MyPets } from './features/dash/page/my-pets-page/my-pets-page';
import { PetReportsComponent } from './features/dash/page/pet-reports/pet-reports';
import { SightingReportComponent } from './features/dash/page/sighting-report/sighting-report';
import { PageConfiguration } from './features/dash/page/page-configuration/page-configuration';
import { PageMyProfile } from './features/dash/page/page-my-profile/page-my-profile';

import { AdminPage } from './features/admin/page/admin-page/admin-page';
import { AdminReportesPage } from './features/admin/page/admin-reportes-page/admin-reportes-page';
import { AdminPanelPage } from './features/admin/page/admin-panel-page/admin-panel-page';
import { PowerBI } from './features/admin/page/power-bi/power-bi';
import { LostReportFormComponent } from './features/dash/page/lost-report-form/lost-report-form';
import { authGuard, adminGuard } from './core/guards/auth-guard';
import { AdminUsersPage } from './features/admin/page/admin-users-page/admin-users-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    component: HomePage,
    title: 'Pet-Centric',
  },

  {
    path: 'login',
    component: LoginPage,
    title: 'Iniciar sesión',
  },

  {
    path: 'registro',
    component: RegisterPage,
    title: 'Crear cuenta',
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordPage,
    title: 'Recuperar contraseña',
  },

  {
    path: 'reset-password',
    component: ResetPasswordPage,
    title: 'Restablecer contraseña',
  },

  {
    path: 'verify-email',
    component: VerifyEmailPage,
    title: 'Verificar correo',
  },

  {
    path: 'dashboard',
    component: DashPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'mascotas',
        pathMatch: 'full',
      },

      {
        path: 'mascotas',
        component: MyPets,
        title: 'Mis mascotas',
      },

      {
        path: 'reportes',
        component: PetReportsComponent,
        title: 'Reportes de mascotas',
      },

      {
        path: 'reportar-avistamiento',
        component: SightingReportComponent,
        title: 'Reportar avistamiento de mascota',
      },

      {
        path: 'reportar-perdida',
        component: LostReportFormComponent,
        title: 'Reportar mascota perdida',
      },

      {
        path: 'configuracion',
        component: PageConfiguration,
        title: 'Configuración',
      },

      {
        path: 'mi-perfil',
        component: PageMyProfile,
        title: 'Mi perfil',
      },
    ],
  },

  {
    path: 'admin',
    component: AdminPage,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        component: AdminReportesPage,
        title: 'Dashboard',
      },

      {
        path: 'panel',
        component: AdminPanelPage,
        title: 'Panel de administración',
      },

      {
        path: 'powerbi',
        component: PowerBI,
        title: 'Power BI',
      },
      {
        path: 'mi-perfil',
        component: PageMyProfile,
        title: 'Mi perfil',
      },
      {
        path: 'usuarios',
        component: AdminUsersPage,
        title: 'Gestión de usuarios',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
