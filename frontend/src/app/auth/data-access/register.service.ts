import {inject, Injectable} from '@angular/core';
import {catchError, firstValueFrom, map, of, throwError} from "rxjs";
import {RegisterFormModel} from "../feature/register-page/register-form/register-form.schema";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {InvalidCredentialsError} from "./login.service";
import {encode} from "@msgpack/msgpack";
import {KeyService} from "../../shared/data-access/key-service";


@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private readonly http = inject(HttpClient);
    private readonly keyService = inject(KeyService);


    checkIfEmailIsAvailable(email: string) {
        const body = new HttpParams()
            .set("value", email);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post("/api/auth/availability/email", body.toString(), {
            headers: headers
        }).pipe(
            map(() => true),
            catchError(() => {
                return of(false);
            })
        )
    }

    checkIfUsernameIsAvailable(username: string) {
        const body = new HttpParams()
            .set("value", username);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post("/api/auth/availability/username", body.toString(), {
            headers: headers
        }).pipe(
            map(() => true),
            catchError(() => {
                return of(false);
            })
        )
    }

    //Zastanowic sie czy przed wyslaniem hasla do backendu nie powinienem go dodatkowo zahashowac
    //(tak zeby serwer nie znal hasla) analogicznie z loginem
    async register(registerFormModel: RegisterFormModel) {
        //Zastanowic się czy nie trzeba zabezpieczyć tego, żeby nie można było podawać cały czas haseł,
        //i testować co powstaje
        const wrapperParams = await this.keyService.generateAndSaveKEKWrapperParameters();
        await this.keyService.generateKEKWrapper(registerFormModel.password);
        const keyPair = await this.keyService.generateAndExportRsaKeyPair();

        const requestBody = {
            "email": registerFormModel.email,
            "username": registerFormModel.username,
            "password": registerFormModel.password,
            "public_key": new Uint8Array(keyPair.publicKey),
            "encrypted_private_key": new Uint8Array(keyPair.encryptedPrivateKey),
            "salt": new Uint8Array(wrapperParams.salt),
            "iv": new Uint8Array(wrapperParams.iv)
        };

        const binaryBlob = new Blob([new Uint8Array(encode(requestBody))], {type: "application/x-msgpack"});
        return firstValueFrom(this.http.post("/api/auth/register", binaryBlob, {
            withCredentials: false,
            headers: new HttpHeaders({
                "Content-Type": "application/x-msgpack"
            })
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return throwError(() => new InvalidCredentialsError());
                } else {
                    return throwError(() => new Error("Unexpected error"));
                }
            })
        ));
    }
}
