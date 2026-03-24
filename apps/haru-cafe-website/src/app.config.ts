import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './routing/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import {
    provideClientHydration,
    withEventReplay,
} from '@angular/platform-browser';
import { primeNgThemeProvider } from './theme.config';
import { HttpCookieCredentialsInterceptor } from './interceptors/http-cookie-credentials.interceptor';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { Config } from './configs/config.schema';
import { config } from './configs/config';

const hasFirebaseApiKey = (config.firebase.apiKey ?? '').trim().length > 0;

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideClientHydration(withEventReplay()),
        provideZonelessChangeDetection(),
        provideBrowserGlobalErrorListeners(),
        { provide: Config, useValue: config },
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
    ],
};
