import {Routes} from '@angular/router';
import {HomeDefault} from './home/feature/home-default/home-default';
import {MessageList} from "./home/feature/home-default/message-list/message-list";
import {MessageDetails} from "./home/feature/home-default/message-list/message-details/message-details";
import {NewMessageForm} from "./home/feature/home-default/new-message-form/new-message-form";

export const routes: Routes = [
    {
        path: 'inbox',
        component: HomeDefault,
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
        path: 'login',
        loadComponent: () => import('./auth/feature/login-page/login-page').then((m) => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import("./auth/feature/register-page/register-page").then(m => m.RegisterPage)
    }
];
