import {Injectable} from '@angular/core';
import {debounceTime, delay, of, switchMap} from "rxjs";
import {RegisterFormModel} from "../feature/register-page/register-form/register-form.schema";


@Injectable({
    providedIn: 'root',
})
export class RegisterService {
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
        //dummy register
        return of(true).pipe(
            delay(2000),
            switchMap(result => {
                return of(undefined);
            })
        )
    }
}
