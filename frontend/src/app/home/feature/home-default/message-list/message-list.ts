import {Component, inject, signal} from '@angular/core';
import {MatDivider, MatListItem, MatNavList} from "@angular/material/list";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {catchError, combineLatest, firstValueFrom, of, switchMap, tap} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MessageService} from "../../../data-access/message-service";
import {MessageDto} from "../../../data-access/dto/message-dto";

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
        combineLatest([
            this.route.queryParams,
            this.messageService.refresh$
        ]).pipe(
            tap(() => this.isLoading.set(true)),
            switchMap(([params, _]) => {
                const isSent = params["type"] === "sent";
                const result$ = isSent ? this.messageService.getSentMessages() : this.messageService.getMessages();
                return result$.pipe(
                    tap(() => this.isLoading.set(false)),
                    catchError(err => {
                        this.isLoading.set(false);
                        this.showSnackBarError("Failed to load messages. Try again later.");
                        return of([] as MessageDto[]);
                    })
                )
            })
        ),
        {initialValue: [] as MessageDto[]}
    );

    protected async onMessageRead(event: MouseEvent, message: MessageDto){
        event.preventDefault();
        if(message.read){
            return;
        }
        try{
            await firstValueFrom(this.messageService.markMessageAsRead(message.id));
        }catch(e){
            this.showSnackBarError("Could not mark specified message as read.")
        }
    }

    private showSnackBarError(message: string){
        this.snackBar.open(message, "Close",
            {
                duration: 5000,
                horizontalPosition: "center",
                verticalPosition: "bottom",
                panelClass: ["error-snackbar"]
            });
    }
}

