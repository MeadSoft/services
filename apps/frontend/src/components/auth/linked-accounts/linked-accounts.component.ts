// auth/linked-accounts.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthProviderService } from 'src/services/auth/auth-provider.service';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-linked-accounts',
    templateUrl: './linked-accounts.component.html',
    styleUrls: ['./linked-accounts.component.css'],
})
export class LinkedAccountsComponent {
    error: string | null = null;

    constructor(
        private readonly auth: Auth,
        private readonly authProviderService: AuthProviderService,
    ) {}

    isLinked(providerId: string): boolean {
        const user = this.auth.currentUser;
        return user
            ? this.authProviderService
                  .getLinkedProviders(user)
                  .includes(providerId)
            : false;
    }

    async linkGoogle() {
        try {
            await this.authProviderService.linkGoogle();
        } catch (e: any) {
            this.error = e.message;
        }
    }

    async linkMicrosoft() {
        try {
            await this.authProviderService.linkMicrosoft();
        } catch (e: any) {
            this.error = e.message;
        }
    }

    async unlink(providerId: string) {
        try {
            await this.authProviderService.unlinkProvider(providerId);
        } catch (e: any) {
            this.error = e.message;
        }
    }
}
