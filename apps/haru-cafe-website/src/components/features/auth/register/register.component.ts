import { Component, inject, signal } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IamService } from '../../../../services/auth/iam.service';
import { IamClient } from '@meadsoft/iam-http-client-angular';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MIN_PASSWORD_LENGTH } from '@meadsoft/iam-contracts';

const passwordsMatchValidator: ValidatorFn = (
    group: AbstractControl,
): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
};

@Component({
    selector: 'haru-register',
    templateUrl: './register.component.html',
    imports: [ButtonModule, InputTextModule, ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
    private readonly authClient = inject(IamClient);

    readonly error = signal<string | null>(null);
    readonly isLoading = signal<boolean>(false);
    readonly registerForm;

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: IamService,
        private readonly router: Router,
    ) {
        this.registerForm = this.fb.group(
            {
                email: ['', [Validators.required, Validators.email]],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(MIN_PASSWORD_LENGTH),
                    ],
                ],
                confirmPassword: ['', Validators.required],
            },
            { validators: passwordsMatchValidator },
        );
    }

    get passwordsMismatch(): boolean {
        return (
            this.registerForm.hasError('passwordsMismatch') &&
            !!this.registerForm.get('confirmPassword')?.dirty
        );
    }

    async registerWithEmailPassword() {
        const { email, password } = this.registerForm.getRawValue();
        if (!email || !password) return;
        try {
            this.isLoading.set(true);
            this.error.set(null);
            const principle = await this.authClient.register({
                email,
                password,
            });
            this.auth.setLocalPrinciple(principle);
            await this.router.navigate(['/']);
        } catch (e: unknown) {
            this.error.set(
                e instanceof Error ? e.message : 'Registration failed',
            );
        } finally {
            this.isLoading.set(false);
        }
    }

    // async registerWithGoogle() {
    //     try {
    //         this.isLoading.set(true);
    //         this.error.set(null);
    //         const credential = await this.auth.signInWithGoogle();
    //         const principle = await this.authClient.firebaseLogin(
    //             await credential.user.getIdToken(),
    //         );
    //         this.auth.setLocalPrinciple(principle);
    //         await this.router.navigate(['/']);
    //     } catch (e: unknown) {
    //         this.error.set(
    //             e instanceof Error ? e.message : 'Registration failed',
    //         );
    //     } finally {
    //         this.isLoading.set(false);
    //     }
    // }
}
