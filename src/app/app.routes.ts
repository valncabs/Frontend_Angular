import { Routes } from '@angular/router';

// Home
import { HomePage } from './features/home/page/home-page/home-page';

// Informativas
import { ContactoPage } from './features/contacto/page/contacto-page/contacto-page';

// Auth
import { LoginPage } from './features/auth/page/login-page/login-page';
import { RegisterPage } from './features/auth/page/register-page/register-page';
import { VerifyEmailPage } from './features/auth/page/verify-email-page/verify-email-page';
import { ForgotPasswordPage } from './features/auth/page/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './features/auth/page/reset-password-page/reset-password-page';

// Legal
import { TermsPage } from './features/terms/page/terms-page/terms-page';
import { PrivacyPage } from './features/privacy/page/privacy-page/privacy-page';

export const routes: Routes = [
  // Landing
  {
    path: '',
    component: HomePage,
    title: 'Pet-Centric',
  },

  // Contacto
  {
    path: 'contacto',
    component: ContactoPage,
    title: 'Contacto | Pet-Centric',
  },

  // Auth
  {
    path: 'login',
    component: LoginPage,
    title: 'Iniciar Sesión | Pet-Centric',
  },
  {
    path: 'registro',
    component: RegisterPage,
    title: 'Registro | Pet-Centric',
  },
  {
    path: 'verificar-correo',
    component: VerifyEmailPage,
    title: 'Verificar Correo | Pet-Centric',
  },
  {
    path: 'recuperar-password',
    component: ForgotPasswordPage,
    title: 'Recuperar Contraseña | Pet-Centric',
  },
  {
    path: 'restablecer-password',
    component: ResetPasswordPage,
    title: 'Restablecer Contraseña | Pet-Centric',
  },

  // Legal
  {
    path: 'terminos',
    component: TermsPage,
    title: 'Términos y Condiciones | Pet-Centric',
  },
  {
    path: 'privacidad',
    component: PrivacyPage,
    title: 'Política de Privacidad | Pet-Centric',
  },

  // 404
  {
    path: '**',
    redirectTo: '',
  },
];
