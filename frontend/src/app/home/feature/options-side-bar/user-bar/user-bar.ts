import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {UserService} from "../../../data-access/user-service";
import {AsyncPipe} from "@angular/common";
import {LoginService} from "../../../../auth/data-access/login.service";
import {firstValueFrom} from "rxjs";
import {customError} from "@angular/forms/signals";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-bar',
    imports: [
        MatIcon,
        MatIconButton,
        AsyncPipe
    ],
  templateUrl: './user-bar.html',
  styleUrl: './user-bar.css',
})
export class UserBar {
    private readonly loginService = inject(LoginService);
    protected readonly userService = inject(UserService);
    private readonly router = inject(Router);

    userInfo$ = this.userService.getUserInfo();

    async logoutUser(){
        try {
            await firstValueFrom(this.loginService.logout());
            if (!await this.router.navigate(['/login'])) {
                throw new Error('Routing failed');
            }
            return undefined;
        } catch (error) {
            return customError({
                message: 'Unexpected error while trying to log in',
                kind: "logout-error"
            })
        }
    }

}
