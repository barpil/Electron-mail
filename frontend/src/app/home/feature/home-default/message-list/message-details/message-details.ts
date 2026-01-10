import {Component, inject, input, signal} from '@angular/core';
import {MessageService} from "../../../../data-access/message-service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {catchError, of, switchMap, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DatePipe} from "@angular/common";
import {MatDivider} from "@angular/material/list";
import {MatChip, MatChipAvatar, MatChipSet} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {AttachmentsDto} from "../../../../data-access/dto/attachments-dto";

@Component({
    selector: 'app-message-details',
    imports: [
        MatProgressSpinner,
        DatePipe,
        MatDivider,
        MatChipAvatar,
        MatIcon,
        MatChipSet,
        MatChip
    ],
    templateUrl: './message-details.html',
    styleUrls: ['./message-details.css', '../../../../../shared/styles/general.css']
})
export class MessageDetails {
    id = input.required<number>();

    readonly messageService = inject(MessageService);
    readonly snackBar = inject(MatSnackBar);

    readonly isLoading = signal(true);

    readonly message = toSignal(
        toObservable(this.id).pipe(
            tap(() => this.isLoading.set(true)),
            switchMap(value =>
                this.messageService.getMessage(value).pipe(
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


    protected downloadAttachment(attachment: AttachmentsDto) {
        const blob = new Blob([attachment.data.slice()], { type: 'application/octet-stream' });
        const url = globalThis.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.name;
        link.click();

        globalThis.URL.revokeObjectURL(url);
    }

    protected formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
