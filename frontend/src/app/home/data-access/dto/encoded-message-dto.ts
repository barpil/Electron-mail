export interface EncodedMessageDto {
    id: number;
    sender: string;
    receivers: string[];
    date: number[];  //Zobaczyc czy mapuje na tablice [Y, M, D, H, M, S] czy normalnie na date
    read: boolean;
    encodedMessage: Uint8Array;
    key: Uint8Array;
    iv: Uint8Array
}