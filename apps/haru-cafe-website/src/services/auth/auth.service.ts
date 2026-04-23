import { computed, inject, Injectable, Optional, signal } from '@angular/core';
import {
    Auth,
    OAuthProvider,
    signInWithPopup,
    UserCredential,
} from '@angular/fire/auth';
import { AuthClient } from '@meadsoft/auth-client-angular';
import type { User } from '@meadsoft/auth-contracts';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly authClient = inject(AuthClient);
    /**
     * undefined = backend session check not yet complete
     * null      = no active backend session
     * User      = authenticated application user
     */
    private readonly _apiUser = signal<User | null | undefined>(undefined);
    readonly apiUser = computed(() => this._apiUser() ?? null);
    readonly isAuthReady = computed(() => this._apiUser() !== undefined);
    readonly isAuthenticated = computed(
        () => this._apiUser() !== null && this._apiUser() !== undefined,
    );

    constructor(@Optional() private readonly firebaseAuth: Auth | null) {
        this.fetchAndSetAuthenticatedUser();
    }

    fetchAndSetAuthenticatedUser(): void {
        this.authClient
            .me()
            .then((user) => {
                this._apiUser.set(user);
            })
            .catch(() => {
                this._apiUser.set(null);
            });
    }

    setLocalUser(user: User | null) {
        this._apiUser.set(user);
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
