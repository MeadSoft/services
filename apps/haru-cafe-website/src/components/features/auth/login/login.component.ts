// auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth/auth.service';
import { IamClient } from '@meadsoft/iam-http-client-angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'haru-login',
    templateUrl: './login.component.html',
    imports: [ButtonModule, InputTextModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
    readonly error = signal<string | null>(null);
    readonly isLoading = signal<boolean>(false);
    readonly loginForm;

    private readonly authClient = inject(IamClient);
    private readonly route = inject(ActivatedRoute);

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly router: Router,
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    async loginWithEmailPassword() {
        const { email, password } = this.loginForm.getRawValue();
        if (!email || !password) return;
        try {
            this.isLoading.set(true);
            this.error.set(null);
            const principle = await this.authClient.login({ email, password });
            this.auth.setLocalPrinciple(principle);
            await this.navigateAfterLogin();
        } catch (e: unknown) {
            this.error.set(e instanceof Error ? e.message : 'Login failed');
        } finally {
            this.isLoading.set(false);
        }
    }

    async loginWithGoogle() {
        try {
            this.isLoading.set(true);
            this.error.set(null);
            const credential = await this.auth.signInWithGoogle();
            const principle = await this.authClient.firebaseLogin(
                await credential.user.getIdToken(),
            );
            this.auth.setLocalPrinciple(principle);
            await this.navigateAfterLogin();
        } catch (e: unknown) {
            this.error.set(e instanceof Error ? e.message : 'Login failed');
        } finally {
            this.isLoading.set(false);
        }
    }

    private async navigateAfterLogin() {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

        // Restrict redirects to in-app absolute paths to avoid open redirects.
        if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
            await this.router.navigateByUrl(returnUrl);
            return;
        }

        await this.router.navigate(['/']);
    }
}
