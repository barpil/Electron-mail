import {Routes} from '@angular/router';
import {HomeDefault} from './home/feature/home-default/home-default';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeDefault
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/feature/login-page/login-page').then((m) => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import("./auth/feature/register-page/register-page").then(m => m.RegisterPage)
    }
];
