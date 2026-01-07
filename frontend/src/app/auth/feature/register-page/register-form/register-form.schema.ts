import {
    customError,
    debounce,
    email,
    maxLength,
    minLength,
    required,
    schema,
    validate,
    validateAsync,
    ValidationError
} from "@angular/forms/signals";
import {inject, resource} from "@angular/core";
import {RegisterService} from "../../../data-access/register.service";
import {firstValueFrom} from "rxjs";

export interface RegisterFormModel{
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export const registerFormSchema = schema<RegisterFormModel>((rootPath) => {
    const registerService = inject(RegisterService);


    required(rootPath.email, {message: "Email is required"});
    minLength(rootPath.email, 8, {message: "Email must be at least 8 characters long"});
    maxLength(rootPath.email, 50, {message: "This email is too long (max 50 characters)"})
    email(rootPath.email, {message: "Please enter a valid email"})

    debounce(rootPath.email, 500);
    validateAsync(rootPath.email, {
        //Przetworzenie sprawdzajace czy w ogole oplaca sie wykonywac operacje async (undefined oznacza ze nie)
        params: (ctx) => {

            const email = ctx.value();
            if (!email || email.length < 8) return undefined;
            return email;
        },
        factory: email => resource({
            params: email,
            loader: async ({params: email}) => {
                return await firstValueFrom(registerService.checkIfEmailIsAvailable(email));
            }
        }),
        onSuccess: (result: boolean) => {
            if (!result) {
                return customError({
                    message: "Specified email is already in use",
                    kind: 'invalid-username'
                })
            }
            return null;
        },
        onError: (error) => {
            return customError({
                message: "Email validation error. Please try again later",
                kind: 'validation-error'
            })
        }

    })


    required(rootPath.username, {message: "Username is required"});
    minLength(rootPath.username, 8, {message: "Username must be at least 8 characters long"});
    maxLength(rootPath.username, 50, {message: "This username is too long (max 50 characters)"})
    debounce(rootPath.username, 500)
    validateAsync(rootPath.username, {
        params: (ctx) => {
            const username = ctx.value();
            if (!username || username.length < 8) return undefined;
            return username;
        },
        factory: username => resource({
            params: username,
            loader: async ({params: username}) => {
                return await firstValueFrom(registerService.checkIfUsernameIsAvailable(username));
            }
        }),
        onSuccess: (result: boolean) => {
            if (!result) {
                return customError({
                    message: "Specified username is already in use",
                    kind: 'invalid-username'
                })
            }
            return null;
        },
        onError: (error) => {
            return customError({
                message: "Username validation error. Please try again later",
                kind: 'validation-error'
            })
        }

    })


    required(rootPath.password);
    maxLength(rootPath.password, 100, {message: "This password is too long (max 100 characters)"})
    validate(rootPath.confirmPassword, (ctx) => {
        const password = ctx.valueOf(rootPath.password);
        const confirmPassword = ctx.value();
        //Jezeli zwraca undefined to wszystko ok.
        return password === confirmPassword ? undefined : customError({
            message: "Passwords do not match",
            kind: "password-inequality"
        })
    })
    validate(rootPath.password, (ctx) => {
        const password = ctx.value() || '';
        const errors: ValidationError[] = [];
        if(password.length<8){
            errors.push(customError({kind: "too-short"}))
        }
        if(!/[a-z]/.test(password)) {
            errors.push(customError({kind: "no-lowercase"}));
        }
        if(!/[A-Z]/.test(password)) {
            errors.push(customError({kind: "no-uppercase"}));
        }
        if(!/\d/.test(password)) {
            errors.push(customError({kind: "no-digit"}));
        }
        if(!/[!@#$%^&*]/.test(password)) {
            errors.push(customError({kind: "no-special"}));
        }

        return errors.length > 0 ? errors : undefined;
    });
})