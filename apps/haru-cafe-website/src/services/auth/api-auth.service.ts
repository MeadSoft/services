// auth/api-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '@haru-cafe/models/User';
import { Config } from '@haru-cafe/configs/config.schema';

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
    constructor(
        private readonly config: Config,
        private readonly http: HttpClient,
    ) {}

    async login(email: string, password: string): Promise<User> {
        return await firstValueFrom(
            this.http.post<User>(`${this.config.apiBaseUrl}/auth/login`, {
                email,
                password,
            }),
        );
    }

    async register(
        email: string,
        password: string,
        displayName?: string,
    ): Promise<User> {
        return await firstValueFrom(
            this.http.post<User>(`${this.config.apiBaseUrl}/auth/register`, {
                email,
                password,
                displayName,
            }),
        );
    }

    async exchangeFirebaseToken(idToken: string): Promise<User> {
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${idToken}`,
        );
        return await firstValueFrom(
            this.http.post<User>(
                `${this.config.apiBaseUrl}/auth/firebase-login`,
                null,
                { headers },
            ),
        );
    }

    async logout(): Promise<void> {
        await firstValueFrom(
            this.http.post(`${this.config.apiBaseUrl}/auth/logout`, null),
        );
    }

    async getCurrentUser(): Promise<User> {
        return await firstValueFrom(
            this.http.get<User>(`${this.config.apiBaseUrl}/auth/me`),
        );
    }
}
