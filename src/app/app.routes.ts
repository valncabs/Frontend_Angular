import { Routes } from '@angular/router';

import { HomePage } from './features/home/page/home-page/home-page';
import { DashPage } from './features/dashboard-shell/page/dash-page/dash-page';
import { AdminPage } from './features/admin/page/admin-page/admin-page';

import { authGuard, adminGuard } from './core/guards/auth-guard';

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
    loadComponent: () =>
      import('./features/auth/page/login-page/login-page').then((m) => m.LoginPage),
    title: 'Iniciar sesión',
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/page/register-page/register-page').then((m) => m.RegisterPage),
    title: 'Crear cuenta',
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/page/forgot-password-page/forgot-password-page').then(
        (m) => m.ForgotPasswordPage,
      ),
    title: 'Recuperar contraseña',
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/page/reset-password-page/reset-password-page').then(
        (m) => m.ResetPasswordPage,
      ),
    title: 'Restablecer contraseña',
  },

  {
    path: 'verify-email',
    loadComponent: () =>
      import('./features/auth/page/verify-email-page/verify-email-page').then(
        (m) => m.VerifyEmailPage,
      ),
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
        loadComponent: () =>
          import('./features/pets/page/my-pets-page/my-pets-page').then((m) => m.MyPetsPage),
        title: 'Mis mascotas',
      },

      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reports/page/pet-reports/pet-reports').then(
            (m) => m.PetReportsComponent,
          ),
        title: 'Reportes de mascotas',
      },

      {
        path: 'reportar-avistamiento',
        loadComponent: () =>
          import('./features/reports/page/sighting-report-page/sighting-report').then(
            (m) => m.SightingReportComponent,
          ),
        title: 'Reportar avistamiento de mascota',
      },

      {
        path: 'reportar-perdida',
        loadComponent: () =>
          import('./features/reports/page/lost-report-form-page/lost-report-form').then(
            (m) => m.LostReportFormComponent,
          ),
        title: 'Reportar mascota perdida',
      },

      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/settings/page/page-configuration/page-configuration').then(
            (m) => m.PageConfiguration,
          ),
        title: 'Configuración',
      },

      {
        path: 'mi-perfil',
        loadComponent: () =>
          import('./features/profile/page/page-my-profile/page-my-profile').then(
            (m) => m.PageMyProfile,
          ),
        title: 'Mi perfil',
      },

      {
        path: 'mensajes',
        loadComponent: () =>
          import('./features/messaging/page/messaging-page/messaging-page').then(
            (m) => m.MessagingPageComponent,
          ),
        title: 'Mensajes',
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
        loadComponent: () =>
          import('./features/admin/page/admin-reportes-page/admin-reportes-page').then(
            (m) => m.AdminReportesPage,
          ),
        title: 'Dashboard',
      },

      {
        path: 'panel',
        loadComponent: () =>
          import('./features/admin/page/admin-panel-page/admin-panel-page').then(
            (m) => m.AdminPanelPage,
          ),
        title: 'Panel de administración',
      },

      {
        path: 'powerbi',
        loadComponent: () =>
          import('./features/admin/page/power-bi/power-bi').then((m) => m.PowerBI),
        title: 'Power BI',
      },

      {
        path: 'mi-perfil',
        loadComponent: () =>
          import('./features/profile/page/page-my-profile/page-my-profile').then(
            (m) => m.PageMyProfile,
          ),
        title: 'Mi perfil',
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/admin/page/admin-users-page/admin-users-page').then(
            (m) => m.AdminUsersPage,
          ),
        title: 'Gestión de usuarios',
      },

      {
        path: 'mensajes',
        loadComponent: () =>
          import('./features/messaging/page/messaging-page/messaging-page').then(
            (m) => m.MessagingPageComponent,
          ),
        title: 'Mensajes',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
