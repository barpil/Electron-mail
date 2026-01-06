import {inject, Injectable} from '@angular/core';
import {catchError, debounceTime, delay, of, switchMap, throwError} from "rxjs";
import {RegisterFormModel} from "../feature/register-page/register-form/register-form.schema";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {InvalidCredentialsError} from "./login.service";


@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private readonly http = inject(HttpClient);



    checkIfEmailIsAvailable(email: string) {
        return of(email).pipe(
            debounceTime(500),
            switchMap(email => {
                return of(email !== "admin@electron.pl");
            }),
            delay(1000)
        )
    }

    checkIfUsernameIsAvailable(username: string) {
        return of(username).pipe(
            debounceTime(500),
            switchMap(username => {
                return of(username !== "admin-electrona");
            }),
            delay(1000)
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

        return this.http.post("/auth/register", body.toString(), {
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
