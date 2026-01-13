import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {LoginService} from "../../../data-access/login.service";
import {Router} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {customError, Field, form, maxLength, pattern, required, schema, submit} from "@angular/forms/signals";
import {firstValueFrom} from "rxjs";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {QRCodeComponent} from "angularx-qrcode";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'app-tfa-form',
    standalone: true,
    imports: [
        MatProgressSpinner,
        MatFormField,
        MatLabel,
        FormsModule,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatCard,
        Field,
        MatError,
        MatCardActions,
        QRCodeComponent,
        MatInput,
        MatButton
    ],
    templateUrl: './tfa-form.html',
    styleUrl: './tfa-form.css',
})
export class TfaForm implements OnInit{
    private readonly loginService = inject(LoginService);
    private readonly router = inject(Router);

    protected isLoading = signal(true);
    protected isSetupMode = signal(false);
    protected totpUri = signal<string | null>(null);

    // Form Model oparty na sygnale
    formModel = signal<TFAFormModel>({
        code: ''
    });

    tfaForm = form<TFAFormModel>(this.formModel, tfaSchema);

    ngOnInit() {
        this.checkStatus();
    }

    private async checkStatus() {
        try {
            const isEnabled = await firstValueFrom(this.loginService.checkTfaStatus());
            this.isSetupMode.set(!isEnabled);

            if (this.isSetupMode()) {
                const path = await firstValueFrom(this.loginService.getTotAuthPath());
                this.totpUri.set(path); // Ustawiamy URI dla komponentu QR
            }
        } catch (error) {
            console.error('Initial 2FA check failed', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    protected submitTfaForm() {
        this.isLoading.set(true);

        submit(this.tfaForm, async formSignal => {
            try {
                const model = formSignal().value();
                await firstValueFrom(this.loginService.tfa(model, this.isSetupMode()));

                await this.router.navigate(['/inbox']);
                return undefined;
            } catch (error) {
                return customError({
                    message: 'Invalid verification code. Please try again.',
                    kind: 'tfa-error'
                });
            }
        }).then(() => {
            this.isLoading.set(false);
        });
    }

    limitLength(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.value.length > 6) {
            input.value = input.value.slice(0, 6);
            this.tfaForm.code().value.set(input.value);
        }
    }
}

type TfaState = 'LOADING' | 'SETUP' | 'CHALLENGE' | 'ERROR';

export interface TFAFormModel {
    code: string;
}

export const tfaSchema = schema<TFAFormModel>((rootPath) => {
    required(rootPath.code);
    pattern(rootPath.code, /^[0-9]+$/, {message: "Only numeric values are accepted"});
});

