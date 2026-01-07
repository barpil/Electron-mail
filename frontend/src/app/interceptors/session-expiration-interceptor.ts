import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, throwError} from "rxjs";

export const sessionExpirationInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);


    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if(error.status === 401 && !router.url.startsWith("/login")){
                router.navigate(["/login", {queryParams: {redirectTo: router.url}}]);
            }
            return throwError(() => error);
        })
    );
};
