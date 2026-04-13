import { inject, Injectable, Injector } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from 'src/services/auth/auth.service';
import { ONE_ITEM } from '@meadsoft/common-browser';

export const ADMIN_ROLE = 'haru-cafe.admin';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly injector = inject(Injector);

    canActivate(): Observable<UrlTree | boolean> {
        if (this.authService.isAuthReady()) {
            return of(this.resolveAccess());
        }

        return toObservable(this.authService.isAuthReady, {
            injector: this.injector,
        }).pipe(
            filter((ready) => ready),
            take(ONE_ITEM),
            map(() => this.resolveAccess()),
        );
    }

    private resolveAccess(): UrlTree | boolean {
        if (!this.authService.isAuthenticated()) {
            return this.router.createUrlTree(['/login']);
        }
        const user = this.authService.currentUser();
        if (!user?.roles?.includes(ADMIN_ROLE)) {
            return this.router.createUrlTree(['/']);
        }
        return true;
    }
}
