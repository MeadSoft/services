import { computed, inject, Injectable, Optional, signal } from '@angular/core';
import {
    Auth,
    OAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    User as FirebaseUser,
    UserCredential,
} from '@angular/fire/auth';
import { AuthClient } from '@meadsoft/auth-client-angular';
import type { User } from '@meadsoft/auth-contracts';

@Injectable({ providedIn: 'root' })
export class AuthService {
    /**
     * undefined = Firebase auth state not yet resolved (initializing)
     * null      = no Firebase user signed in
     * FirebaseUser = authenticated via Google/Firebase
     */
    private readonly _firebaseUser = signal<FirebaseUser | null | undefined>(
        undefined,
    );

    /**
     * undefined = API session check not yet complete
     * null      = no active API session
     * User      = authenticated via local email/password
     */
    private readonly _apiUser = signal<User | null | undefined>(undefined);

    readonly isAuthReady = computed(() => {
        const firebaseUser = this._firebaseUser();
        if (firebaseUser === undefined) return false;
        if (firebaseUser !== null) return true;
        return this._apiUser() !== undefined;
    });

    readonly isAuthenticated = computed(
        () =>
            (this._firebaseUser() !== null &&
                this._firebaseUser() !== undefined) ||
            (this._apiUser() !== null && this._apiUser() !== undefined),
    );

    readonly currentUser = computed(() => this._apiUser() ?? null);

    constructor(@Optional() private readonly auth: Auth | null) {
        const authClient = inject(AuthClient);
        if (!this.auth) {
            this._firebaseUser.set(null);
        } else {
            onAuthStateChanged(this.auth, (user) =>
                this._firebaseUser.set(user),
            );
        }

        authClient
            .me()
            .then((user) => this._apiUser.set(user))
            .catch(() => this._apiUser.set(null));
    }

    setLocalUser(user: User | null) {
        this._apiUser.set(user);
    }

    async signInWithGoogle(): Promise<UserCredential> {
        const auth = this.getRequiredAuth();
        const provider = new OAuthProvider('google.com');
        return await signInWithPopup(auth, provider);
    }

    async signOut(): Promise<void> {
        if (this.auth) {
            await this.auth.signOut();
        }
        this._firebaseUser.set(null);
        this._apiUser.set(null);
    }

    private getRequiredAuth(): Auth {
        if (!this.auth) {
            throw new Error('Firebase Auth is not configured');
        }
        return this.auth;
    }
}
