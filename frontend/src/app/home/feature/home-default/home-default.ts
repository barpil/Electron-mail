import { Component } from '@angular/core';
import {MessageList} from "./message-list/message-list";
import {OptionsSideBar} from "../options-side-bar/options-side-bar";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-home-default',
    imports: [
        MessageList,
        OptionsSideBar,
        RouterOutlet
    ],
  templateUrl: './home-default.html',
  styleUrl: './home-default.css',
})
export class HomeDefault {

}
