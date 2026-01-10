import {Component} from '@angular/core';
import {OptionsSideBar} from "../options-side-bar/options-side-bar";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-home-default',
    imports: [
        OptionsSideBar,
        RouterOutlet
    ],
  templateUrl: './home-default.html',
  styleUrl: './home-default.css',
})
export class HomeDefault {

}
