import {AttachmentsDto} from "../../data-access/dto/attachments-dto";

export interface MessagePayloadDto {
    subject: string;
    text: string;
    attachments: AttachmentsDto[];
}