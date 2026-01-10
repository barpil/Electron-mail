import {AttachmentsDto} from "./attachments-dto";

export interface MessageDto{
    id: number;
    sender: string;
    receiver: string;
    date: Date;
    isRead: boolean;

    subject: string;
    text: string;
    attachments: AttachmentsDto[];
}