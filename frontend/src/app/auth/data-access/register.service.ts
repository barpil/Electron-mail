import {inject, Injectable} from '@angular/core';
import {catchError, debounceTime, delay, map, of, switchMap, throwError} from "rxjs";
import {RegisterFormModel} from "../feature/register-page/register-form/register-form.schema";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {InvalidCredentialsError} from "./login.service";
import {email} from "@angular/forms/signals";


@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private readonly http = inject(HttpClient);



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

    register(registerFormModel: RegisterFormModel) {
        const body = new HttpParams()
            .set('email', registerFormModel.email)
            .set('username', registerFormModel.username)
            .set('password', registerFormModel.password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post("/api/auth/register", body.toString(), {
            headers: headers,
            withCredentials: false
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
}
