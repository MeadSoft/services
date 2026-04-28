import { type Provider } from '@angular/core';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import { IamClient } from './controllers';

export const IAM_CLIENT_PROVIDERS: Provider[] = [IamClient];

export function provideIamClient(apiBaseUrl: string): Provider[] {
    return [
        { provide: API_BASE_URL_TOKEN, useValue: apiBaseUrl },
        ...IAM_CLIENT_PROVIDERS,
    ];
}
