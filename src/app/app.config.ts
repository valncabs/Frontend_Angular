import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideAuth0 } from '@auth0/auth0-angular';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(withInterceptorsFromDi()),

    provideAuth0({
      domain: 'dev-ukkb01mu1aknyu4h.us.auth0.com',
      clientId: 'FL9OxuiPAHqgqxmPevNOshZcE4vovqnp',

      authorizationParams: {
        redirect_uri: window.location.origin,
      },

      cacheLocation: 'localstorage',
      useRefreshTokens: true,
    }),
  ],
};
