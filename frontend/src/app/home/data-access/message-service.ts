import {inject, Injectable} from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    firstValueFrom,
    forkJoin,
    map,
    Observable,
    shareReplay,
    switchMap,
    tap,
    throwError
} from "rxjs";
import {NewMessageFormModel} from "../feature/home-default/new-message-form/new-message-form";
import {EncodedMessageDto} from "./dto/encoded-message-dto";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {decode, encode} from "@msgpack/msgpack";
import {MessageDto} from "./dto/message-dto";
import {MessagePayloadDto} from "../util/dto/message-payload-dto";
import {AttachmentsDto} from "./dto/attachments-dto";
import {EncryptionService} from "../../shared/data-access/encryption-service";
import {GetUserInfoResponse, UserService} from "./user-service";


@Injectable({
    providedIn: 'root',
})
export class MessageService {

    private readonly http = inject(HttpClient);
    private readonly encryptionService = inject(EncryptionService);
    private readonly userService = inject(UserService);

    private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

    private messagesCache$?: Observable<MessageDto[]>;
    private sentMessagesCache$?: Observable<MessageDto[]>;

    refresh(){
        this.clearCache();
        this.refreshTrigger$.next();
    }
    get refresh$(){return this.refreshTrigger$.asObservable()}

    public clearCache(){
        this.messagesCache$ = undefined;
        this.sentMessagesCache$ = undefined;
    }

    getMessages(forceRefresh = false): Observable<MessageDto[]> {
        if (forceRefresh || !this.messagesCache$) {
            this.messagesCache$ = this.http.get("/api/messages/received", {
                responseType: "arraybuffer",
                withCredentials: true
            }).pipe(
                switchMap(response => this.mapGetMessagesResponseToMessageDtos(response)),
                shareReplay(1),
            );
        }
        return this.messagesCache$;
    }

    getSentMessages(forceRefresh = false): Observable<MessageDto[]> {
        if (forceRefresh || !this.sentMessagesCache$) {
            this.sentMessagesCache$ = this.http.get("/api/messages/sent", {
                responseType: "arraybuffer",
                withCredentials: true
            }).pipe(
                switchMap(response => this.mapGetMessagesResponseToMessageDtos(response)),
                shareReplay(1),
            );
        }
        return this.sentMessagesCache$;
    }

    private async mapGetMessagesResponseToMessageDtos(response: ArrayBuffer): Promise<MessageDto[]> {
        const decodedResponse = decode(new Uint8Array(response)) as GetMessagesResponse;
        const decryptionPromises = decodedResponse.messages.map(msg =>
            this.encryptionService.decryptMessage(msg)
        );
        return await Promise.all(decryptionPromises);
    }

    getMessage(messageId: number): Observable<MessageDto> {
        return forkJoin([this.getMessages(), this.getSentMessages()]).pipe(
            map(([received, sent]) => {
                const message = received.find(m => m.id === Number(messageId)) ??
                    sent.find(m => m.id === Number(messageId))
                if(!message){throw new MessageNotFoundError("Message not found");}
                return message
            })
        )
    }

    markMessagesAsRead(messagesIds: number[]){
        const params = new HttpParams().set("messages", messagesIds.join(','))
        return this.http.get(`/api/messages/read`, {withCredentials: true, params: params}).pipe(
            catchError(err => {
                throw new Error("Messages could not be mark as read.")
            })
        )
    }

    deleteMessages(messagesIds: number[]){
        const params = new HttpParams().set("messages", messagesIds.join(','))
        return this.http.delete(`/api/messages/delete`, {withCredentials: true, params: params}).pipe(
            catchError(err => {
                throw new Error("Messages could not be deleted.")
            })
        )
    }

    async sendMessage(messageForm: NewMessageFormModel) {
        const attachments: AttachmentsDto[] = await Promise.all(
            messageForm.attachments.map(async (file): Promise<AttachmentsDto> => {
                const buffer = await file.arrayBuffer();
                return {
                    name: file.name,
                    data: new Uint8Array(buffer),
                    size: file.size
                }
            })
        );
        const messagePayload: MessagePayloadDto = {
            subject: messageForm.subject,
            text: messageForm.content,
            attachments: attachments
        };

        //Dodanie wysylajacego zeby mial mozliwosc podem w wyslanych wyswietlenia wiadomosci
        const senderEmail = (await firstValueFrom(this.userService.getUserInfo())).email;

        const encryptionResult = await this.encryptionService
            .encryptMessagePayload(messagePayload, senderEmail, messageForm.recipients);
        const requestBody: SendMessageRequest = {
            messageKeysInfos: encryptionResult.messageKeysInfos,
            encryptedMessage: new Uint8Array(encryptionResult.encryptedPayload),
            iv: new Uint8Array(encryptionResult.iv)
        }

        const binaryBlob = new Blob([new Uint8Array(encode(requestBody))], {type: "application/x-msgpack"});
        return this.http.post("/api/messages/send", binaryBlob, {
            withCredentials: true,
            headers: new HttpHeaders({
                "Content-Type": "application/x-msgpack"
            })
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => new Error("Message sending error"));
            })
        ).subscribe();
    }

}

export interface SendMessageRequest {
    messageKeysInfos: MessageKeyInfo[],
    encryptedMessage: Uint8Array,
    iv: Uint8Array
}

export interface MessageKeyInfo {
    email: string,
    isSender: boolean,
    isReceiver: boolean,
    key: Uint8Array
}

export class MessageNotFoundError extends Error {
}

export interface GetMessagesResponse {
    messages: EncodedMessageDto[];
}




