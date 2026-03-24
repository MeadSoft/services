// auth/auth.service.ts
import { computed, Injectable, Optional, signal } from '@angular/core';
import {
    Auth,
    OAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    User,
    UserCredential,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = signal<User | null>(null);
    isAuthenticated = computed(() => {
        return this.user() !== null;
    });

    constructor(@Optional() private readonly auth: Auth | null) {
        if (!this.auth) return;
        onAuthStateChanged(this.auth, (user) => {
            this.user.set(user);
        });
    }

    async signInWithMicrosoft(): Promise<UserCredential> {
        return await this.signInWithProvider('microsoft.com');
    }

    async signInWithGoogle(): Promise<UserCredential> {
        return await this.signInWithProvider('google.com');
    }

    private async signInWithProvider(
        providerId: string,
    ): Promise<UserCredential> {
        const auth = this.getRequiredAuth();
        const provider = new OAuthProvider(providerId);
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential;
    }

    async signOut(): Promise<void> {
        const auth = this.getRequiredAuth();
        await auth.signOut();
    }

    private getRequiredAuth(): Auth {
        if (!this.auth) {
            throw new Error('Firebase Auth is not configured');
        }
        return this.auth;
    }
}
