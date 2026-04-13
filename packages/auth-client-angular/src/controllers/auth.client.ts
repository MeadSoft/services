import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import type {
    User,
    ILocalLoginRequest,
    ILocalRegisterRequest,
} from '@meadsoft/auth-contracts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClient {
    constructor(
        @Inject(API_BASE_URL_TOKEN) private readonly apiBaseUrl: string,
        private readonly http: HttpClient,
    ) {}

    async firebaseLogin(idToken: string): Promise<User> {
        return await firstValueFrom(
            this.http.post<User>(
                `${this.apiBaseUrl}/auth/firebase-login`,
                {},
                {
                    headers: new HttpHeaders({
                        authorization: idToken,
                    }),
                    withCredentials: true,
                },
            ),
        );
    }

    async register(request: ILocalRegisterRequest): Promise<User> {
        return await firstValueFrom(
            this.http.post<User>(`${this.apiBaseUrl}/auth/register`, request, {
                withCredentials: true,
            }),
        );
    }

    async login(request: ILocalLoginRequest): Promise<User> {
        return await firstValueFrom(
            this.http.post<User>(`${this.apiBaseUrl}/auth/login`, request, {
                withCredentials: true,
            }),
        );
    }

    async logout(): Promise<void> {
        await firstValueFrom(
            this.http.post(
                `${this.apiBaseUrl}/auth/logout`,
                {},
                {
                    withCredentials: true,
                },
            ),
        );
    }

    async me(): Promise<User> {
        return await firstValueFrom(
            this.http.get<User>(`${this.apiBaseUrl}/auth/me`, {
                withCredentials: true,
            }),
        );
    }
}
