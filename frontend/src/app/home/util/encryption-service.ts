import {Injectable} from '@angular/core';
import {EncodedMessageDto} from "../data-access/dto/encoded-message-dto";
import {decode, encode} from "@msgpack/msgpack";
import {MessagePayloadDto} from "./dto/message-payload-dto";
import {MessageDto} from "../data-access/dto/message-dto";

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {

    public async encryptMessagePayload(message: MessagePayloadDto){
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
        const aes128Key = globalThis.crypto.getRandomValues(new Uint8Array(16));

        //Zakodowanie payloadu poprzez MsgPack
        const encodedPayload = encode(message);

        const encryptedPayload = await this.encryptAES(encodedPayload, aes128Key, iv);

        return {encryptedPayload: encryptedPayload, key: aes128Key, iv: iv}
    }



    public async decryptMessage(encodedMessage: EncodedMessageDto){
        //Bedzie trzeba dodac tez szyfrowanie klucza asymetryczne, tymczasowo klucz jawny
        const decryptedBuffer = await this.decryptAES(
            encodedMessage.encodedMessage,
            encodedMessage.key,
            encodedMessage.iv)

        //Odkodowanie obiektu MsgPackiem
        const decodedMessagePayload = decode(new Uint8Array(decryptedBuffer)) as MessagePayloadDto;

        return this.mapEncodedMessageAndMessagePayloadToMessage(encodedMessage, decodedMessagePayload);
    }



    private async encryptAES(data: Uint8Array, key: Uint8Array, iv: Uint8Array){
        const aesKey = await globalThis.crypto.subtle.importKey(
            "raw", new Uint8Array(key), "AES-GCM", true, ["encrypt"]
        );

        return await globalThis.crypto.subtle.encrypt(
            {name: "AES-GCM", iv: new Uint8Array(iv)},
            aesKey,
            new Uint8Array(data)
        );
    }

    private async decryptAES(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<ArrayBuffer>{
        const aesKey = await globalThis.crypto.subtle.importKey(
            "raw", new Uint8Array(key), "AES-GCM", true, ["decrypt"]
        );

        return await globalThis.crypto.subtle.decrypt(
            {name: "AES-GCM", iv: new Uint8Array(iv)},
            aesKey,
            new Uint8Array(data)
        );
    }

    private mapEncodedMessageAndMessagePayloadToMessage(encodedMessage: EncodedMessageDto, messagePayload: MessagePayloadDto): MessageDto{
        const [y, m, d, hh, mm, _] = encodedMessage.date;
        const date = new Date(y, m-1, d, hh, mm, 0);

        return {
            id: encodedMessage.id,
            sender: encodedMessage.sender,
            receiver: encodedMessage.receiver,
            date: date,
            isRead: encodedMessage.isRead,
            subject: messagePayload.subject,
            text: messagePayload.text,
            attachments: messagePayload.attachments
        };
    }

    private getMessagePayloadFromMessage(message: MessageDto): MessagePayloadDto{
        return {
            subject: message.subject,
            text: message.text,
            attachments: message.attachments
        };
    }
}
