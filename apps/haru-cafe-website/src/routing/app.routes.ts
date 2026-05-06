import { Routes } from '@angular/router';
import { LoginComponent } from '@haru-cafe/components/features/auth/login/login.component';
import { RegisterComponent } from '@haru-cafe/components/features/auth/register/register.component';
import { NotFoundComponent } from '@haru-cafe/components/pages/not-found/not-found.component';
import { LandingPageComponent } from '@haru-cafe/components/pages/landing-page/landing-page.component';
import { AdminPageComponent } from '@haru-cafe/components/pages/admin-page/admin-page.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: LandingPageComponent,
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminPageComponent, canActivate: [AdminGuard] },
    { path: '404', component: NotFoundComponent },
    { path: '홈', redirectTo: '/', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' },
];
