import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {inject} from "@angular/core";
import {catchError, map, of} from "rxjs";
import {environment} from "../../environments/environment";
import {KeyService} from "../shared/data-access/key-service";
import {MessageService} from "../home/data-access/message-service";

const checkSession = (stateUrl: string) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const keyService = inject(KeyService);
    const messageService = inject(MessageService);
    const sessionValidateEndpoint = environment.sessionAuthEndpoint;

    return http.get(sessionValidateEndpoint, {withCredentials: true}).pipe(
        map(() => true),
        catchError(async () => {
            messageService.clearCache();
            await keyService.clearEncryptionData();
            router.navigate(["/login"], {queryParams: {redirectTo: stateUrl}});
            return false;
        })
    );
}


export const SessionAuthGuard: CanActivateFn = (route, state) => {
    return checkSession(state.url);
};

export const SessionAuthChildGuard: CanActivateChildFn = (route, state) => {
    return checkSession(state.url);
}
