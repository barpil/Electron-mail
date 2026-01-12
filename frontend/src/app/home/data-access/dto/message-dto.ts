import {AttachmentsDto} from "./attachments-dto";

export interface MessageDto{
    id: number;
    sender: string;
    receivers: string[];
    date: Date;
    read: boolean;

    subject: string;
    text: string;
    attachments: AttachmentsDto[];
}