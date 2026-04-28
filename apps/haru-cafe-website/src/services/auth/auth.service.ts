import { computed, inject, Injectable, Optional, signal } from '@angular/core';
import {
    Auth,
    OAuthProvider,
    signInWithPopup,
    UserCredential,
} from '@angular/fire/auth';
import { IamClient } from '@meadsoft/iam-http-client-angular';
import type { IPrinciple } from '@meadsoft/iam-contracts';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly authClient = inject(IamClient);
    /**
     * undefined = backend session check not yet complete
     * null      = no active backend session
     * Principle = authenticated application principle
     */
    private readonly _apiPrinciple = signal<IPrinciple | null | undefined>(
        undefined,
    );
    readonly apiPrinciple = computed(() => this._apiPrinciple() ?? null);
    readonly isAuthReady = computed(() => this._apiPrinciple() !== undefined);
    readonly isAuthenticated = computed(
        () =>
            this._apiPrinciple() !== null && this._apiPrinciple() !== undefined,
    );

    constructor(@Optional() private readonly firebaseAuth: Auth | null) {
        this.fetchAndSetAuthenticatedPrinciple();
    }

    fetchAndSetAuthenticatedPrinciple(): void {
        this.authClient
            .me()
            .then((principle) => {
                this._apiPrinciple.set(principle);
            })
            .catch(() => {
                this._apiPrinciple.set(null);
            });
    }

    setLocalPrinciple(principle: IPrinciple | null) {
        this._apiPrinciple.set(principle);
    }

    async signInWithGoogle(): Promise<UserCredential> {
        const auth = this.getRequiredAuth();
        const provider = new OAuthProvider('google.com');
        return await signInWithPopup(auth, provider);
    }

    private getRequiredAuth(): Auth {
        if (!this.firebaseAuth) {
            throw new Error('Google Auth is not configured');
        }
        return this.firebaseAuth;
    }
}
