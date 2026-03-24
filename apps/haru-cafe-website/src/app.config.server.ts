import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './routing/app.server.routes';
import {
    provideClientHydration,
    withIncrementalHydration,
} from '@angular/platform-browser';

const serverOnlyConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        provideClientHydration(withIncrementalHydration()),
    ],
};

export const serverConfig = mergeApplicationConfig(appConfig, serverOnlyConfig);
