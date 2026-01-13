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
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
    selector: 'app-message-list',
    imports: [
        MatNavList,
        MatListItem,
        DatePipe,
        MatDivider,
        RouterLink,
        MatProgressSpinner,
        MatIcon,
        MatIconButton,
        MatTooltip,
        MatCheckbox
    ],
    templateUrl: './message-list.html',
    styleUrl: './message-list.css',
})
export class MessageList {
    readonly messageService = inject(MessageService);
    readonly snackBar = inject(MatSnackBar);

    readonly route = inject(ActivatedRoute);
    protected isLoading = signal(true);
    protected selectedMessagesIds = signal<Set<number>>(new Set());

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
            await firstValueFrom(this.messageService.markMessagesAsRead([message.id]));
        }catch(e){
            this.showSnackBarError("Could not mark specified message as read.")
        }
    }

    protected selectMessage(messageId: number){
        this.selectedMessagesIds.update(selection => {
            const newSelection = new Set(selection);
            if(newSelection.has(messageId)) newSelection.delete(messageId);
            else newSelection.add(messageId);
            return newSelection;
        })
    }

    protected async deleteSelectedMessages(){
        await firstValueFrom(this.messageService.deleteMessages([...this.selectedMessagesIds().values()]));
        this.selectedMessagesIds.update(() => {
            return new Set();
        })
        this.messageService.refresh();
    }

    protected async markAsReadSelectedMessages(){
       await firstValueFrom(this.messageService.markMessagesAsRead([...this.selectedMessagesIds().values()]));
        this.selectedMessagesIds.update(() => {
            return new Set();
        })
       this.messageService.refresh();
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

