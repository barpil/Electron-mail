import {inject, Injectable} from '@angular/core';
import {LoginFormModel} from "../feature/login-page/login-form/login-form";
import {catchError, concatMap, map, shareReplay, switchMap, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {decode} from "@msgpack/msgpack";
import {GetMessagesResponse, MessageService} from "../../home/data-access/message-service";
import {KeyService} from "../../shared/data-access/key-service";
import {TFAFormModel} from "../feature/login-page/tfa-form/tfa-form";

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private readonly http = inject(HttpClient);
    private readonly keyService = inject(KeyService);
    private readonly messageService = inject(MessageService);
    private passwordCache: string | null = null;


    login(loginFormModel: LoginFormModel) {
        const body = new HttpParams()
            .set("email", loginFormModel.email)
            .set("password", loginFormModel.password);

        const headers = new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded"
        });

        return this.http.post("/api/auth/login", body.toString(), {
            headers: headers,
            withCredentials: true
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return throwError(() => new InvalidCredentialsError());
                } else {
                    return throwError(() => new Error("Unexpected error"));
                }
            }),
            //TO TRZEBA BEDZIE PRZENIESC ZEBY DOPIERO SIE DZIALO JEZELI SIE UDA 2FA
            tap(() => {
                this.passwordCache = loginFormModel.password;
            })
        );
    }

    checkTfaStatus(){
        return this.http.get<TFAStatusResponse>("/api/auth/2fa/status", {
            withCredentials: true
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return throwError(() => new InvalidCredentialsError());
                } else {
                    return throwError(() => new Error("Unexpected error"));
                }
            }),
            map(response => response.value)
        );
    }

    getTotAuthPath(){
        return this.http.get<GetTotAuthPathResponse>("/api/auth/2fa/qr", {
            withCredentials: true
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return throwError(() => new InvalidCredentialsError());
                } else {
                    return throwError(() => new Error("Unexpected error"));
                }
            }),
            map(response => response.totAuthPath)
        );

    }



    tfa(tfaFormModel: TFAFormModel, enable2FA: boolean = false){
        const body = new HttpParams()
            .set("code", tfaFormModel.code)
            .set("setup", enable2FA);

        const headers = new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded"
        });

        return this.http.post("/api/auth/2fa", body.toString(), {
            headers: headers,
            withCredentials: true
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return throwError(() => new InvalidCredentialsError());
                } else {
                    return throwError(() => new Error("Unexpected error"));
                }
            }),
            switchMap(async () => {
                await this.keyService.loadEncryptionParametersFromServer();
                await this.keyService.generateKEKWrapper(this.passwordCache!);
                this.passwordCache = null;
            })
        );

    }

    logout() {
        return this.http.post("/api/auth/logout", {}, {withCredentials: true}).pipe(
            catchError(error => {
                return throwError(() => new Error("Unexpected error"));
            }),
            switchMap(() => {
                this.messageService.clearCache();
                return this.keyService.clearEncryptionData();
            })
        );
    }
}


export class InvalidCredentialsError extends Error {
    constructor() {
        super("Passed credentails were incorrect");
    }
}

export interface TFAStatusResponse{
    value: boolean;
}

export interface GetTotAuthPathResponse{
    totAuthPath: string;
}

