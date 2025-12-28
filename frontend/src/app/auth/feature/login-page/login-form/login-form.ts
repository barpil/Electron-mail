import {Component, inject, signal} from '@angular/core';
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {customError, email, Field, form, required, schema, submit} from "@angular/forms/signals";
import {MatButton} from "@angular/material/button";
import {InvalidCredentialsError, LoginService} from "../../../data-access/login.service";
import {firstValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-login-form',
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        Field,
        MatCardActions,
        MatButton,
        MatError,
        MatProgressSpinner
    ],
    templateUrl: './login-form.html',
    styleUrl: './login-form.css',
    standalone: true
})
export class LoginForm {
    private readonly loginService = inject(LoginService);
    private readonly router = inject(Router)

    protected isLoading = false;
    formModel = signal<LoginFormModel>({
        email: '',
        password: '',
    });

    loginForm = form<LoginFormModel>(this.formModel, loginFormSchema);

    protected submitLoginForm() {
        this.isLoading = true;
        submit(this.loginForm, async form => {
            try {
                await firstValueFrom(this.loginService.login(form().value()))
                if (!await this.router.navigate(['/home'])) {
                    throw new Error('Routing failed')
                }
                return undefined; //jesli undefined to wszystko zadzialalo
            } catch (error) {
                if (error instanceof InvalidCredentialsError) {
                    return customError({
                        message: 'Passed email or password is incorrect',
                        kind: "logging-error"
                    })
                }

                return customError({
                    message: 'Unexpected error while trying to log in',
                    kind: "logging-error"
                })
            }
        }).then(() => {
            this.isLoading = false
        });

    }
}

export interface LoginFormModel{
    email: string;
    password: string;
}

export const loginFormSchema = schema<LoginFormModel>((rootPath) => {
    required(rootPath.email);
    email(rootPath.email);
    required(rootPath.password);
})