import {Component, signal} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatDivider, MatListItem, MatListItemIcon, MatListItemTitle, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatButton} from "@angular/material/button";

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
        MatSidenavContent,
        MatListItemTitle,
        MatListItemIcon,
        RouterLinkActive,
        MatButton
    ],
    templateUrl: './options-side-bar.html',
    styleUrls: ['./options-side-bar.css', '../../../shared/styles/general.css'],
})
export class OptionsSideBar {
    readonly folders = signal<NavItem[]>([
        {label: 'Received', icon: 'inbox', route: '/inbox', queryParams: {}},
        {label: 'Sent', icon: 'send', route: '/inbox', queryParams: {type: 'sent'}},
    ]);

    readonly newMessageLink = {route: '/inbox/new-message'}
}

interface NavItem {
    label: string;
    icon: string;
    route: string;
    queryParams: any;
}
