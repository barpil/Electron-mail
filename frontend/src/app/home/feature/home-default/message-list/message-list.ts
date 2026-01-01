import {Component, inject, signal} from '@angular/core';
import {MatDivider, MatListItem, MatNavList} from "@angular/material/list";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MessageListItem, MessageService} from "../../../data-access/message-service";
import {toSignal} from "@angular/core/rxjs-interop";
import {catchError, of, switchMap, tap} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-message-list',
    imports: [
        MatNavList,
        MatListItem,
        DatePipe,
        MatDivider,
        RouterLink,
        MatProgressSpinner
    ],
    templateUrl: './message-list.html',
    styleUrl: './message-list.css',
})
export class MessageList {
    readonly messageService = inject(MessageService);
    readonly snackBar = inject(MatSnackBar);

    readonly route = inject(ActivatedRoute);
    protected isLoading = signal(true);

    readonly messages = toSignal(
        this.route.queryParams.pipe(
            tap(() => this.isLoading.set(true)),
            switchMap(params => {
                const isSent = params["type"] === "sent";
                const result$ = isSent ? this.messageService.getSentMessages() : this.messageService.getMessages();
                return result$.pipe(
                    tap(() => this.isLoading.set(false)),
                    catchError(err => {
                        this.isLoading.set(false);
                        this.snackBar.open("Failed to load messages. Try again later.", "Close",
                            {
                                duration: 5000,
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                panelClass: ["error-snackbar"]
                            });
                        return of([] as MessageListItem[]);
                    })
                )
            })
        ),
        {initialValue: [] as MessageListItem[]}
    );
}

