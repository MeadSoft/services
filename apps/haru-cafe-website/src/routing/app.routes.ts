import { Routes } from '@angular/router';
import { LoginComponent } from 'src/components/features/auth/login/login.component';
import { NotFoundComponent } from 'src/components/pages/not-found/not-found.component';
import { LandingPageComponent } from 'src/components/pages/landing-page/landing-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent,
    },
    { path: 'login', component: LoginComponent },
    { path: '404', component: NotFoundComponent },
    { path: '홈', redirectTo: '/', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' },
];
