export interface EncodedMessageDto {
    id: number;
    sender: string;
    receiver: string;
    date: number[];  //Zobaczyc czy mapuje na tablice [Y, M, D, H, M, S] czy normalnie na date
    isRead: boolean;
    encodedMessage: Uint8Array;
    key: Uint8Array;
    iv: Uint8Array
}