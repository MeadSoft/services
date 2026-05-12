import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
// import {
//     provideClientHydration,
//     withEventReplay,
// } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideIamClient } from '@meadsoft/iam-http-client-angular';
import { EMPTY_LENGTH } from '@meadsoft/common';
import { routes } from './routing/app.routes';
import { HttpCookieCredentialsInterceptor } from './interceptors/http-cookie-credentials.interceptor';
import { primeNgThemeProvider } from './theme.config';
import { Config } from './configs/config.schema';
import { config } from './configs/config';
import { provideRestaurantCatalog } from '@meadsoft/restaurant-catalog-http-client-angular';

const hasFirebaseApiKey =
    (config.firebase.apiKey ?? '').trim().length > EMPTY_LENGTH;

export const appConfig: ApplicationConfig = {
    providers: [
        // ##################################################
        // code infra
        provideRouter(routes),
        provideHttpClient(),
        // provideClientHydration(withEventReplay()),
        provideZonelessChangeDetection(),
        provideBrowserGlobalErrorListeners(),
        ...(hasFirebaseApiKey
            ? [
                  provideFirebaseApp(() => initializeApp(config.firebase)),
                  provideAuth(() => getAuth()),
              ]
            : []),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpCookieCredentialsInterceptor,
            multi: true,
        },
        primeNgThemeProvider,
        // ...googleAuthProviders,

        // ##################################################
        // business services
        { provide: Config, useValue: config },
        provideRestaurantCatalog(config.apiBaseUrl),
        provideIamClient(config.apiBaseUrl),
    ],
};
