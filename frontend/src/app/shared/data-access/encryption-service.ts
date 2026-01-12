import {inject, Injectable} from '@angular/core';

import {decode, encode} from "@msgpack/msgpack";

import {IDBPDatabase, openDB} from "idb";
import {MessagePayloadDto} from "../../home/util/dto/message-payload-dto";
import {EncodedMessageDto} from "../../home/data-access/dto/encoded-message-dto";
import {MessageDto} from "../../home/data-access/dto/message-dto";
import {KeyService} from "./key-service";
import {MessageKeyInfo} from "../../home/data-access/message-service";

@Injectable({
    providedIn: 'root',
})
export class EncryptionService {
    private readonly db: Promise<IDBPDatabase>;
    private readonly keyService = inject(KeyService);

    constructor() {
        this.db = openDB("ElectronDB", 1, {
            upgrade(db) {
                db.createObjectStore("keys");
            }
        });
    }

    public async encryptMessagePayload(message: MessagePayloadDto, senderEmail: string, receiverEmails: string[]) {
        //Zakodowanie payloadu poprzez MsgPack
        const encodedPayload = encode(message);

        const encryptionResult = await this.encryptAES(encodedPayload);
        const messageKeyInfos: MessageKeyInfo[] = [];

        let isSenderAlsoAReceiver = false;
        if(receiverEmails.includes(senderEmail)){
            isSenderAlsoAReceiver = true;
        }
        messageKeyInfos.push({email: senderEmail, isSender: true, isReceiver: isSenderAlsoAReceiver,
        key: new Uint8Array(await this.keyService.wrapMessageAESKey(encryptionResult.aesKey, senderEmail))})

        for (const receiverEmail of receiverEmails) {
            if(receiverEmail!==senderEmail){
                messageKeyInfos.push({email: receiverEmail, isSender: false, isReceiver: true,
                    key: new Uint8Array(await this.keyService.wrapMessageAESKey(encryptionResult.aesKey, receiverEmail))})
            }
        }
        return {encryptedPayload: encryptionResult.encryptedData, messageKeysInfos: messageKeyInfos, iv: encryptionResult.iv};
    }


    public async decryptMessage(encodedMessage: EncodedMessageDto) {
        //Bedzie trzeba dodac tez szyfrowanie klucza asymetryczne, tymczasowo klucz jawny
        const decryptedBuffer = await this.decryptWithEncryptedAESKey(
            encodedMessage.encodedMessage,
            encodedMessage.key,
            encodedMessage.iv)

        //Odkodowanie obiektu MsgPackiem
        const decodedMessagePayload = decode(new Uint8Array(decryptedBuffer)) as MessagePayloadDto;

        return this.mapEncodedMessageAndMessagePayloadToMessage(encodedMessage, decodedMessagePayload);
    }


    private async encryptAES(data: Uint8Array) {
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
        const initializingVector = globalThis.crypto.getRandomValues(new Uint8Array(16));
        const aesKey = await globalThis.crypto.subtle.importKey(
            "raw", new Uint8Array(initializingVector), "AES-GCM", true, ["encrypt"]
        );

        const encryptedData =  await globalThis.crypto.subtle.encrypt(
            {name: "AES-GCM", iv: new Uint8Array(iv)}, aesKey, new Uint8Array(data)
        );
        return {encryptedData, aesKey, iv};
    }

    private async decryptWithEncryptedAESKey(data: Uint8Array, encryptedKey: Uint8Array, iv: Uint8Array): Promise<ArrayBuffer> {
        const aesKey = await this.keyService.unwrapMessageAESKey(encryptedKey.slice().buffer)

        return await globalThis.crypto.subtle.decrypt(
            {name: "AES-GCM", iv: new Uint8Array(iv)},
            aesKey,
            new Uint8Array(data)
        );
    }

    private mapEncodedMessageAndMessagePayloadToMessage(encodedMessage: EncodedMessageDto, messagePayload: MessagePayloadDto): MessageDto {
        const [y, m, d, hh, mm, _] = encodedMessage.date;
        const date = new Date(y, m - 1, d, hh, mm, 0);

        return {
            id: encodedMessage.id,
            sender: encodedMessage.sender,
            receivers: encodedMessage.receivers,
            date: date,
            read: encodedMessage.read,
            subject: messagePayload.subject,
            text: messagePayload.text,
            attachments: messagePayload.attachments
        };
    }

}
