import { Injectable, Optional } from '@angular/core';
import {
    Auth,
    GoogleAuthProvider,
    linkWithPopup,
    OAuthProvider,
    unlink,
    User,
} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthProviderService {
    constructor(@Optional() public readonly auth: Auth | null) {}

    async linkMicrosoft() {
        return this.linkProvider('microsoft.com');
    }

    async linkGoogle() {
        return this.linkProvider(GoogleAuthProvider.PROVIDER_ID);
    }

    private async linkProvider(providerId: string) {
        const auth = this.getRequiredAuth();
        const provider = new OAuthProvider(providerId);
        const user = auth.currentUser;
        if (!user) throw new Error('No user signed in');

        if (user) {
            const linked = this.getLinkedProviders(user);
            console.log('Linked providers:', linked);

            if (!this.isProviderLinked(user, providerId)) {
                console.log(
                    `${providerId} not linked — prompt user to link it.`,
                );
            }
        }

        try {
            const result = await linkWithPopup(user, provider);
            console.log(`Linked ${providerId} account:`, result.user);
        } catch (error) {
            console.error('Linking failed:', error);
        }
    }

    async unlinkProvider(providerId: string) {
        const auth = this.getRequiredAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('No user signed in');
        return unlink(user, providerId);
    }

    getLinkedProviders(user: User): string[] {
        return user.providerData.map((p) => p.providerId);
    }

    isProviderLinked(user: User, providerId: string): boolean {
        return this.getLinkedProviders(user).includes(providerId);
    }

    private getRequiredAuth(): Auth {
        if (!this.auth) {
            throw new Error('Firebase Auth is not configured');
        }
        return this.auth;
    }
}
