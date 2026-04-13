import { type Provider } from '@angular/core';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import { AuthClient } from './controllers';
import { AuthClients } from './auth-client.service';

export const AUTH_CLIENT_PROVIDERS: Provider[] = [AuthClient, AuthClients];

export function provideAuthClient(apiBaseUrl: string): Provider[] {
    return [
        { provide: API_BASE_URL_TOKEN, useValue: apiBaseUrl },
        ...AUTH_CLIENT_PROVIDERS,
    ];
}
