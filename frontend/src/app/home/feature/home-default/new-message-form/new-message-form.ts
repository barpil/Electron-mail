import {Component, inject, signal} from '@angular/core';
import {MatDivider} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {
    MatChipAvatar,
    MatChipEditedEvent,
    MatChipGrid,
    MatChipInput,
    MatChipInputEvent,
    MatChipRemove,
    MatChipRow
} from "@angular/material/chips";
import {FormsModule} from "@angular/forms";
import {MessageService} from "../../../data-access/message-service";
import {Router} from "@angular/router";
import {customError, Field, form, maxLength, required, submit} from "@angular/forms/signals";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";

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
        CdkTextareaAutosize,
        MatChipInput
    ],
    templateUrl: './new-message-form.html',
    styleUrls: ['./new-message-form.css', '../../../../shared/styles/general.css']
})
export class NewMessageForm {
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);

    protected recipientErrors = signal<string[]>([]);
    protected isLoading = signal(false);

    formModel = signal<NewMessageFormModel>({
        recipients: [],
        subject: '',
        content: '',
        attachments: []
    })

    newMessageForm = form<NewMessageFormModel>(this.formModel, (rootPath) => {
        required(rootPath.recipients, {message: "At least 1 recipient's email is required"});

        required(rootPath.subject, {message: "Message subject is required"});
        maxLength(rootPath.subject, 100, {message: "Subject is too long (max 100 characters)"})

        maxLength(rootPath.content, 2048, {message: "Exceeded maximum message length (max 2048 characters)"})

        maxLength(rootPath.attachments, 5, {message: "Too many attachments (max 5 per message)"})
    })

    readonly separatorKeysCodes = [ENTER, SPACE, COMMA] as const;
    addRecipient(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.formModel.update(formState => ({
                ...formState, recipients: [...formState.recipients, value]
            }));
        }
        event.chipInput!.clear();
    }

    removeRecipient(email: string): void {
        this.formModel.update(formState => ({
            ...formState, recipients: formState.recipients.filter(r => r !== email)
        }));
    }

    editRecipients(email: string, event: MatChipEditedEvent){
        const newValue = event.value.trim();
        //Jezeli wszystko z pola usuniete to trzeba usunac calego chipa
        if (!newValue) {
            this.removeRecipient(email);
            return;
        }

        this.formModel.update(formState => {
            const recipients = [...formState.recipients];
            const index = recipients.indexOf(email);
            if (index != -1) {
                recipients[index] = newValue;
                return {...formState, recipients: recipients};
            }
            return formState;
        });
    }


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

    protected readonly ENTER = ENTER;
    protected readonly COMMA = COMMA;
}

export interface NewMessageFormModel {
    recipients: string[];
    subject: string;
    content: string;
    attachments: File[];
}
