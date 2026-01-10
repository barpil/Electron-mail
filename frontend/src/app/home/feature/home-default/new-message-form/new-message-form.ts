import {Component, inject, signal} from '@angular/core';
import {MatDivider} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatChipAvatar, MatChipGrid, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {FormsModule} from "@angular/forms";
import {MessageService} from "../../../data-access/message-service";
import {Router} from "@angular/router";
import {customError, Field, form, maxLength, required, submit} from "@angular/forms/signals";
import {firstValueFrom} from "rxjs";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
    selector: 'app-new-message-form',
    imports: [
        MatDivider,
        MatIcon,
        MatChipRow,
        FormsModule,
        Field,
        MatCard,
        MatChipRemove,
        MatChipAvatar,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatLabel,
        MatFormField,
        MatError,
        MatInput,
        MatHint,
        MatButton,
        MatCardActions,
        MatProgressSpinner,
        MatChipGrid,
        CdkTextareaAutosize
    ],
    templateUrl: './new-message-form.html',
    styleUrls: ['./new-message-form.css', '../../../../shared/styles/general.css']
})
export class NewMessageForm {
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);


    protected isLoading = signal(false);

    formModel = signal<NewMessageFormModel>({
        recipient: '',
        subject: '',
        content: '',
        attachments: []
    })

    newMessageForm = form<NewMessageFormModel>(this.formModel, (rootPath) => {
        required(rootPath.recipient, {message: "Recipient's username is required"});

        required(rootPath.subject, {message: "Message subject is required"});
        maxLength(rootPath.subject, 100, {message: "Subject is too long (max 100 characters)"})

        maxLength(rootPath.content, 2048, {message: "Exceeded maximum message length (max 2048 characters)"})

        maxLength(rootPath.attachments, 5, {message: "Too many attachments (max 5 per message)"})
    })

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const newFiles = Array.from(input.files);
            this.formModel.update(formState => ({
                ...formState, attachments: [...formState.attachments, ...newFiles]
            }));
            input.value = "";
        }
    }

    removeAttachment(index: number) {
        this.formModel.update(formState => ({
            ...formState, attachments: formState.attachments.filter((_, i) => i !== index)
        }));
    }

    onSend() {
        this.isLoading.set(true);
        submit(this.newMessageForm, async form => {
            try {
                await this.messageService.sendMessage(form().value())
                if (!await this.router.navigate(['/inbox'])) {
                    throw new Error("Routing failed");
                }
                return undefined;
            } catch (error) {
                return customError({
                    message: 'Unexpected error while trying to send message',
                    kind: 'message-sending-error'
                })
            }
        }).then(() => {
            this.isLoading.set(false);
        })
    }
}

export interface NewMessageFormModel {
    recipient: string;
    subject: string;
    content: string;
    attachments: File[];
}
