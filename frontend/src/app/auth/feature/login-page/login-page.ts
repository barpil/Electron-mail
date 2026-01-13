import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-login-page',
    imports: [
        RouterOutlet
    ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  standalone: true
})
export class LoginPage {

}
