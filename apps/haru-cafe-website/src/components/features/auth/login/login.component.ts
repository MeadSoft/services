// auth/login.component.ts
import { Component, signal } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { ApiAuthService } from 'src/services/auth/api-auth.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UserCredential } from '@angular/fire/auth';

@Component({
    selector: 'haru-login',
    templateUrl: './login.component.html',
    imports: [ButtonModule],
})
export class LoginComponent {
    error = signal<string | null>(null);

    constructor(
        private auth: AuthService,
        private apiAuth: ApiAuthService,
        private router: Router,
    ) {}

    async loginWithGoogle() {
        return await this.login(this.auth.signInWithGoogle());
    }

    async loginWithMicrosoft() {
        return await this.login(this.auth.signInWithMicrosoft());
    }

    private async login(loginPromise: Promise<UserCredential>) {
        const userCredentials = await loginPromise.catch((e) => {
            this.error.set(e?.message ?? 'Login failed');
        });
        if (!userCredentials) return;
        console.log(userCredentials);

        await this.apiAuth.exchangeFirebaseToken(
            await userCredentials.user.getIdToken(),
        );
        this.router.navigate(['/']);
    }
}
