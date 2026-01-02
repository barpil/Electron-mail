import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {LogoutService} from "../../../data-access/logout-service";
import {UserService} from "../../../data-access/user-service";

@Component({
  selector: 'app-user-bar',
    imports: [
        MatIcon,
        MatButton,
        MatIconButton
    ],
  templateUrl: './user-bar.html',
  styleUrl: './user-bar.css',
})
export class UserBar {
    private readonly logoutService = inject(LogoutService);
    protected readonly userService = inject(UserService);

    logoutUser(){
        this.logoutService.logout();
    }
}
