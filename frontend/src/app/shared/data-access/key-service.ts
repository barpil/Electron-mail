import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, firstValueFrom, lastValueFrom, switchMap, throwError} from "rxjs";
import {decode} from "@msgpack/msgpack";
import {IDBPDatabase, openDB} from "idb";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class KeyService {
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly db: Promise<IDBPDatabase>;

    private initPromise: Promise<void> | null = null;

    constructor() {
        this.db = openDB("ElectronDB", 1, {
            upgrade(db) {
                db.createObjectStore("keys");
            }
        });
    }



    public async loadEncryptionParametersFromServer() {
        await firstValueFrom(this.http.get("/api/user/key", {
            responseType: "arraybuffer",
            withCredentials: true
        }).pipe(
            switchMap(async (response) => {
                const decodedResponse: GetEncryptionParametersResponse = decode(new Uint8Array(response)) as GetEncryptionParametersResponse;
                return await this.saveEncryptionParametersToDb(decodedResponse.encryptedKey, decodedResponse.salt, decodedResponse.iv);
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => new Error("Could not load encryption parameters"));
            })
        ));
    }

    private async getUsersPublicKey(email: string): Promise<CryptoKey> {
        const response = await lastValueFrom(
            this.http.get(`/api/user/${email}/key`, {
                responseType: "arraybuffer",
                withCredentials: true
            }).pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => new Error("Could not load users public key"));
                })
            )
        );

        const decodedResponse: GetKeyResponse = decode(new Uint8Array(response)) as GetKeyResponse;
        return await globalThis.crypto.subtle.importKey(
            "spki", new Uint8Array(decodedResponse.key), {name: "RSA-OAEP", hash: "SHA-256"},
            true, ["wrapKey"]
        );
    }

    private async getPrivateKey(): Promise<CryptoKey> {
        const db = await this.db;
        let encodedRpk = await db.get("keys", "rpk");
        if (!encodedRpk){
            await this.loadEncryptionParametersFromServer()
            encodedRpk = await db.get("keys", "rpk");
            if(!encodedRpk) throw new Error("RPK could not be found nor initialized");
        }
        return await this.unwrapPrivateKeyWithKek(encodedRpk);
    }


    //---- Key methods ----


    //Tworzy pare kluczy RSA, prywatny zapisywany do IndexedDB, publiczny zwracany
    //Przy rejestracji. Klucz Publiczny wysylany do backendu do zapisu/ ewentualnie przy zmianie hasła
    public async generateAndExportRsaKeyPair() {
        const keyPair = await globalThis.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, true, ["encrypt", "decrypt"])
        const exportedPublicKey = await globalThis.crypto.subtle.exportKey(
            "spki", keyPair.publicKey
        );
        const encryptedPrivateKey = await this.wrapPrivateKeyWithKek(keyPair.privateKey);
        return {publicKey: exportedPublicKey, encryptedPrivateKey: encryptedPrivateKey};
    }

    private async saveEncryptionParametersToDb(wrappedKey: Uint8Array, salt: Uint8Array, iv: Uint8Array) {
        const db = await this.db;
        await db.put("keys", wrappedKey, "rpk");
        await db.put("keys", salt, "salt")
        await db.put("keys", iv, "iv")
    }

    public async generateAndSaveKEKWrapperParameters(){
        const db = await this.db;
        const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
        await db.put("keys", salt, "salt");
        await db.put("keys", iv, "iv");
        return {salt: salt, iv: iv};
    }

    public async clearEncryptionData(){
        const db = await this.db;
        await db.delete("keys", "salt");
        await db.delete("keys", "iv");
        await db.delete("keys", "rpk");
        sessionStorage.removeItem("kek");
    }


    //Przy rejestracji(do utworzenia pary kluczy) i logowaniu
    public async generateKEKWrapper(password: string) {
        const salt = await this.getSalt();
        const textEncoder = new TextEncoder();
        const keyFromPassword = await globalThis.crypto.subtle.importKey(
            "raw", textEncoder.encode(password), "PBKDF2", false, ["deriveKey"]);

        const kekKey = await globalThis.crypto.subtle.deriveKey({
                name: "PBKDF2",
                salt: salt.slice().buffer,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyFromPassword, {name: "AES-GCM", length: 128}, true, ["wrapKey", "unwrapKey"]);

        const kekExport = await globalThis.crypto.subtle.exportKey("raw", kekKey);
        sessionStorage.setItem("kek", btoa(String.fromCodePoint(...new Uint8Array(kekExport))));
    }

    private async getKekKey() {
        // await this.ensureInitialized();
        const base64Kek = sessionStorage.getItem("kek");
        if (!base64Kek) throw new Error("KEK not initialized");
        const kekKey = Uint8Array.from(atob(base64Kek), c => c.codePointAt(0)!);
        return await globalThis.crypto.subtle.importKey("raw", kekKey, "AES-GCM", true, ["wrapKey", "unwrapKey"]);
    }

    private async getWrapIv() {
        const db = await this.db;
        let wrapIv: Promise<Uint8Array> = await db.get("keys", "iv");
        if (!wrapIv){
            await this.ensureInitialized();
            wrapIv = await db.get("keys", "iv");
            if(!wrapIv) throw new Error("IV could not be found nor initialized");
        }
        return wrapIv;
    }

    private async getSalt(){
        const db = await this.db;
        let salt: Promise<Uint8Array> = await db.get("keys", "salt");
        if (!salt){
            await this.ensureInitialized();
            salt = await db.get("keys", "salt");
            if(!salt) throw new Error("Salt could not be found nor initialized");
        }
        return salt;
    }

    private async wrapPrivateKeyWithKek(privateKey: CryptoKey) {
        const kekKey = await this.getKekKey();
        const wrapIv = await this.getWrapIv();
        if (!kekKey || !wrapIv) throw new Error("Kek not initialized");
        return await globalThis.crypto.subtle.wrapKey(
            "pkcs8", privateKey, kekKey, {name: "AES-GCM", iv: wrapIv.slice().buffer}
        );
    }

    private async unwrapPrivateKeyWithKek(wrappedPrivateKey: ArrayBuffer) {
        if (!wrappedPrivateKey || wrappedPrivateKey.byteLength === 0) {
            throw new Error("Invalid wrappedPrivateKey: buffer is empty or undefined");
        }
        const kekKey = await this.getKekKey();
        const wrapIv = await this.getWrapIv();
        if (!kekKey || !wrapIv) throw new Error("Kek not initialized");
        return globalThis.crypto.subtle.unwrapKey(
            "pkcs8", wrappedPrivateKey, kekKey, {name: "AES-GCM", iv: wrapIv.slice().buffer}, {name: "RSA-OAEP", hash: "SHA-256"},
            true, ["unwrapKey"]
        );
    }

    public async wrapMessageAESKey(aesKey: CryptoKey, receiverEmail: string) {
        const rsaPublicKey = await this.getUsersPublicKey(receiverEmail);
        return await globalThis.crypto.subtle.wrapKey(
            "raw", aesKey, rsaPublicKey, {name: "RSA-OAEP"}
        );
    }

    public async unwrapMessageAESKey(wrappedAESKey: ArrayBuffer) {
        await this.ensureInitialized();
        const privateKey = await this.getPrivateKey()
        return await globalThis.crypto.subtle.unwrapKey(
            "raw", wrappedAESKey, privateKey, {name: "RSA-OAEP"}, {name: "AES-GCM", length: 128},
            true, ["decrypt"]
        );
    }

    public async ensureInitialized() {
        this.initPromise ??= this.loadEncryptionParametersFromServer();
        return this.initPromise;
    }

}

export interface GetKeyResponse {
    key: Uint8Array;
}

export interface GetEncryptionParametersResponse {
    encryptedKey: Uint8Array;
    salt: Uint8Array;
    iv: Uint8Array;
}


