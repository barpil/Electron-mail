import {Component, inject, signal} from '@angular/core';
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatDivider, MatListItem, MatListItemIcon, MatListItemTitle, MatNavList} from "@angular/material/list";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {UserBar} from "./user-bar/user-bar";
import {LoginService} from "../../../auth/data-access/login.service";
import {firstValueFrom} from "rxjs";
import {customError} from "@angular/forms/signals";
import {MessageService} from "../../data-access/message-service";

@Component({
    selector: 'app-options-side-bar',
    imports: [
        MatSidenavContainer,
        MatSidenav,
        MatIcon,
        MatNavList,
        RouterLink,
        MatListItem,
        MatDivider,
        MatListItemTitle,
        MatListItemIcon,
        RouterLinkActive,
        MatButton,
        UserBar
    ],
    templateUrl: './options-side-bar.html',
    styleUrls: ['./options-side-bar.css', '../../../shared/styles/general.css'],
})
export class OptionsSideBar {
    private readonly messageService = inject(MessageService);

    readonly folders = signal<NavItem[]>([
        {label: 'Received', icon: 'inbox', route: '/inbox', queryParams: {}, action: () => this.refreshReceivedMessages()},
        {label: 'Sent', icon: 'send', route: '/inbox', queryParams: {type: 'sent'}, action: () => this.refreshSentMessages()},
    ]);

    readonly newMessageLink = {route: '/inbox/new-message'}

    protected refreshReceivedMessages(){
        this.messageService.getMessages(true).subscribe();
        this.messageService.refresh();
    }

    protected refreshSentMessages(){
        this.messageService.getSentMessages(true).subscribe();
        this.messageService.refresh();
    }

}

interface NavItem {
    label: string;
    icon: string;
    route: string;
    queryParams: any;
    action?: () => void
}
