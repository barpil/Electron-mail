import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {LogoutService} from "../../../data-access/logout-service";
import {UserService} from "../../../data-access/user-service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-user-bar',
    imports: [
        MatIcon,
        MatButton,
        MatIconButton,
        AsyncPipe
    ],
  templateUrl: './user-bar.html',
  styleUrl: './user-bar.css',
})
export class UserBar {
    private readonly logoutService = inject(LogoutService);
    protected readonly userService = inject(UserService);

    userInfo$ = this.userService.getUserInfo();

    logoutUser(){
        this.logoutService.logout();
    }
}
