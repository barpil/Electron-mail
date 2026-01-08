import {inject, Injectable} from '@angular/core';
import {LoginFormModel} from "../feature/login-page/login-form/login-form";
import {catchError, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private readonly http = inject(HttpClient);

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
            })
        );
    }

    logout() {
        return this.http.post("/api/auth/logout", {}, {withCredentials: true}).pipe(
            catchError(error => {
                return throwError(() => new Error("Unexpected error"));
            })
        );
    }
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: { id: string, email: string }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Passed credentails were incorrect");
    }
}

