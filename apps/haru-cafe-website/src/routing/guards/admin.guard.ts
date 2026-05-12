import { inject, Injectable, Injector } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { IamService } from '@meadsoft/haru-cafe/services/auth/iam.service';
import { ONE_ITEM } from '@meadsoft/common';
import { IRoleWithRelations } from '@meadsoft/iam-contracts';

export const ADMIN_ROLE = 'haru-cafe.admin';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    private readonly authService = inject(IamService);
    private readonly router = inject(Router);
    private readonly injector = inject(Injector);

    canActivate(
        _: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<UrlTree | boolean> {
        if (this.authService.isAuthReady()) {
            return of(this.resolveAccess(state.url));
        }

        return toObservable(this.authService.isAuthReady, {
            injector: this.injector,
        }).pipe(
            filter((ready) => ready),
            take(ONE_ITEM),
            map(() => this.resolveAccess(state.url)),
        );
    }

    private resolveAccess(returnUrl: string): UrlTree | boolean {
        if (!this.authService.isAuthenticated()) {
            return this.router.createUrlTree(['/login'], {
                queryParams: { returnUrl },
            });
        }
        const principle = this.authService.apiPrinciple();
        const roles: (IRoleWithRelations | null)[] =
            principle?.policyBindings!.map((binding) => binding.role) ?? [];
        if (!roles.some((role) => role?.name === ADMIN_ROLE)) {
            return this.router.createUrlTree(['/']);
        }
        return true;
    }
}
