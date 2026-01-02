import {Injectable} from '@angular/core';
import {debounce, delay, interval, of} from "rxjs";
import {NewMessageFormModel} from "../feature/home-default/new-message-form/new-message-form";

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    getMessages() {
        //dummy response
        const response: GetMessagesResponse = {
            messages:
                [
                    {
                        id: 1,
                        sender: 'Zespół Angular',
                        subject: 'Nowości w wersji 20',
                        date: new Date(),
                        isRead: false
                    },
                    {
                        id: 2,
                        sender: 'Jan Kowalski',
                        subject: 'Faktura za usługi',
                        date: new Date('2025-12-20'),
                        isRead: false
                    }]
        }

        //Trzeba pamietac ze to co tu dostaniemy powinno byc zaszyfrowane i tutaj dopiero odszyfrowane
        const result = response.messages;

        return of(result).pipe(
            delay(2000),
        )
    }

    getSentMessages() {
        //dummy response
        const response: GetMessagesResponse = {
            messages:
                [
                    {
                        id: 3,
                        sender: 'You',
                        subject: 'Droga Aniu',
                        date: new Date(),
                        isRead: true
                    },
                    {
                        id: 4,
                        sender: 'You',
                        subject: 'Droga Aniu znowu',
                        date: new Date('2025-12-20'),
                        isRead: true
                    }]
        }

        //Trzeba pamietac ze to co tu dostaniemy powinno byc zaszyfrowane i tutaj dopiero odszyfrowane
        const result = response.messages;

        return of(result).pipe(
            delay(2000),
        )
    }

    getMessageDetails(messageId: string) {
        //dummy response
        let result: MessageDetails;
        switch (messageId) {
            case "1":
                result = {
                    id: 1,
                    sender: 'Zespół Angular',
                    subject: 'Nowości w wersji 20',
                    date: new Date(),
                    content: 'ZOBACZ JAKIE SUPER RZECZY DLA CIEBIE PRZYGOTOWALISMY',
                    isRead: false
                }
                break;
            case "2":
                result = {
                    id: 2,
                    sender: 'Jan Kowalski',
                    subject: 'Faktura za usługi',
                    date: new Date('2025-12-20'),
                    content: 'Prosze o przeslanie tych pieniedzy na moj adres mailowy',
                    isRead: true
                }
                break;
            case "3":
                result = {
                    id: 1,
                    sender: 'You',
                    subject: 'Droga Aniu',
                    date: new Date(),
                    content: 'Hejka co tam u Ciebie?',
                    isRead: true
                }
                break;
            case "4":
                result = {
                    id: 2,
                    sender: 'You',
                    subject: 'Droga Aniu znowu',
                    date: new Date('2025-12-20'),
                    content: 'HALO ODPISZ PROSZE',
                    isRead: true
                }
                break;
            default:
                throw new MessageNotFoundError("Message not found");
        }
        return of(result);
    }

    sendMessage(messageForm: NewMessageFormModel) {
        console.log(`Message sent:
        ${messageForm.recipient}
        ${messageForm.subject}
        ${messageForm.content}
        ${messageForm.attachments}`)
        return of(messageForm).pipe(
            debounce(() => interval(500)),
            delay(1000)
        )
    }

}

export class MessageNotFoundError extends Error {
}


export interface GetMessagesRequest {

}

export interface GetMessagesResponse {
    messages: MessageListItem[];
}

export interface MessageListItem {
    id: number;
    sender: string;
    subject: string;
    date: Date;
    isRead: boolean;
}

export interface MessageDetails {
    id: number;
    sender: string;
    subject: string;
    date: Date;
    content: string;
    isRead: boolean;
}

export interface GetSentMessagesRequest {

}

