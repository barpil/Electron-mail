import {Component, inject, input, signal} from '@angular/core';
import {MessageService} from "../../../../data-access/message-service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {catchError, of, switchMap, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DatePipe} from "@angular/common";
import {MatDivider} from "@angular/material/list";

@Component({
    selector: 'app-message-details',
    imports: [
        MatProgressSpinner,
        DatePipe,
        MatDivider
    ],
    templateUrl: './message-details.html',
    styleUrl: './message-details.css',
})
export class MessageDetails {
    id = input.required<string>();

    readonly messageService = inject(MessageService);
    readonly snackBar = inject(MatSnackBar);

    readonly isLoading = signal(true);

    readonly message = toSignal(
        toObservable(this.id).pipe(
            tap(() => this.isLoading.set(true)),
            switchMap(value =>
                this.messageService.getMessageDetails(value).pipe(
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
                        return of(undefined);
                    })
                )
            )
        )
    );
}
