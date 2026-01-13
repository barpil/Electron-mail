import {Routes} from '@angular/router';
import {HomeDefault} from './home/feature/home-default/home-default';
import {MessageList} from "./home/feature/home-default/message-list/message-list";
import {MessageDetails} from "./home/feature/home-default/message-list/message-details/message-details";
import {NewMessageForm} from "./home/feature/home-default/new-message-form/new-message-form";
import {SessionAuthChildGuard, SessionAuthGuard} from "./guards/session-auth-guard";
import {TfaForm} from "./auth/feature/login-page/tfa-form/tfa-form";
import {LoginForm} from "./auth/feature/login-page/login-form/login-form";

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/feature/login-page/login-page').then((m) => m.LoginPage),
        children: [
            {
                path: '',
                component: LoginForm
            },
            {
                path: '2fa',
                component: TfaForm,
                canActivateChild: [SessionAuthChildGuard]
            }
        ]
    },
    {
        path: 'register',
        loadComponent: () => import("./auth/feature/register-page/register-page").then(m => m.RegisterPage)
    },
    {
        path: 'inbox',
        component: HomeDefault,
        canActivate: [SessionAuthGuard],
        canActivateChild: [SessionAuthChildGuard],
        children: [
            {
                path: '',
                component: MessageList
            },
            {
                path: 'new-message',
                component: NewMessageForm
            },
            {
                path: ':id',
                component: MessageDetails
            },
            {
                path: '**',
                redirectTo: ''
            }

        ]
    },
    {
        path: '**',
        redirectTo: 'inbox'
    }
];
