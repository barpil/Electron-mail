import { Component } from '@angular/core';
import {LoginForm} from "./login-form/login-form";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login-page',
    imports: [
        LoginForm,
        MatButton,
        RouterLink
    ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  standalone: true
})
export class LoginPage {

}
