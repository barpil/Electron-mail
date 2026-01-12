import {inject, Injectable} from '@angular/core';
import {LoginFormModel} from "../feature/login-page/login-form/login-form";
import {catchError, concatMap, shareReplay, switchMap, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {decode} from "@msgpack/msgpack";
import {GetMessagesResponse, MessageService} from "../../home/data-access/message-service";
import {KeyService} from "../../shared/data-access/key-service";

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private readonly http = inject(HttpClient);
    private readonly keyService = inject(KeyService);
    private readonly messageService = inject(MessageService);


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
            switchMap(async () => {
                await this.keyService.loadEncryptionParametersFromServer();
                return this.keyService.generateKEKWrapper(loginFormModel.password);
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

