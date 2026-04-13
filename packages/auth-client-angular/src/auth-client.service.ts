import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import { AuthClient } from './controllers';

@Injectable()
export class AuthClients {
    readonly auth: AuthClient;

    constructor(
        @Inject(API_BASE_URL_TOKEN) apiBaseUrl: string,
        http: HttpClient,
    ) {
        this.auth = new AuthClient(apiBaseUrl, http);
    }
}
