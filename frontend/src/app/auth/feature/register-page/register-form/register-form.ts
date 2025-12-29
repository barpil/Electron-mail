import {Component, inject, signal} from '@angular/core';
import {Router} from "@angular/router";
import {customError, Field, form, submit} from "@angular/forms/signals";
import {firstValueFrom} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RegisterService} from "../../../data-access/register.service";
import {RegisterFormModel, registerFormSchema} from "./register-form.schema";
import {PasswordStrengthChecker} from "../../../ui/password-strength-checker/password-strength-checker";

@Component({
  selector: 'app-register-form',
    imports: [
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        MatProgressSpinner,
        Field,
        PasswordStrengthChecker
    ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
    private readonly registerService = inject(RegisterService);
    private readonly router = inject(Router)

    protected isLoading = false;
    formModel = signal<RegisterFormModel>({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    registerForm = form<RegisterFormModel>(this.formModel, registerFormSchema);

    protected submitRegisterForm() {
        this.isLoading = true;
        submit(this.registerForm, async form => {
            try {
                await firstValueFrom(this.registerService.register(form().value()))
                if (!await this.router.navigate(['/login'])) {
                    throw new Error('Routing failed')
                }
                return undefined; //jesli undefined to wszystko zadzialalo
            } catch (error) {
                return customError({
                    message: 'Unexpected error while trying to log in',
                    kind: "logging-error"
                })
            }
        }).then(() => {
            this.isLoading = false
        });

    }

    protected readonly customError = customError;
}






