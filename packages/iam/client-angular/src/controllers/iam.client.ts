import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL_TOKEN } from '@meadsoft/common-http-client-angular';
import {
    type IPrinciple,
    type ILocalLoginRequest,
    type ILocalRegisterRequest,
    SERVICE_NAME,
} from '@meadsoft/iam-contracts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IamClient {
    constructor(
        @Inject(API_BASE_URL_TOKEN) private readonly apiBaseUrl: string,
        private readonly http: HttpClient,
    ) {}

    async firebaseLogin(idToken: string): Promise<IPrinciple> {
        return await firstValueFrom(
            this.http.post<IPrinciple>(
                `${this.apiBaseUrl}/${SERVICE_NAME}/firebase-login`,
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

    async register(request: ILocalRegisterRequest): Promise<IPrinciple> {
        return await firstValueFrom(
            this.http.post<IPrinciple>(
                `${this.apiBaseUrl}/${SERVICE_NAME}/register`,
                request,
                {
                    withCredentials: true,
                },
            ),
        );
    }

    async login(request: ILocalLoginRequest): Promise<IPrinciple> {
        return await firstValueFrom(
            this.http.post<IPrinciple>(
                `${this.apiBaseUrl}/${SERVICE_NAME}/login`,
                request,
                {
                    withCredentials: true,
                },
            ),
        );
    }

    async logout(): Promise<void> {
        await firstValueFrom(
            this.http.post(
                `${this.apiBaseUrl}/${SERVICE_NAME}/logout`,
                {},
                {
                    withCredentials: true,
                },
            ),
        );
    }

    async me(): Promise<IPrinciple> {
        return await firstValueFrom(
            this.http.get<IPrinciple>(`${this.apiBaseUrl}/${SERVICE_NAME}/me`, {
                withCredentials: true,
            }),
        );
    }
}
