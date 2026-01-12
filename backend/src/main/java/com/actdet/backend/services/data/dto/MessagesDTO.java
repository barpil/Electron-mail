package com.actdet.backend.services.data.dto;

import com.actdet.backend.services.data.repositories.entities.Messages;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessagesDTO{
    Long id;
    String sender;
    List<String> receivers;
    LocalDateTime date;
    boolean isRead;

    byte[] encodedMessage;
    byte[] key;
    byte[] iv;
    List<AttachmentsDTO> attachments;


    public static MessagesDTO mapMessageKeyPairToMessageDTO(MessageInfo messageInfo){
        Messages message = messageInfo.getMessage();
        return MessagesDTO.builder()
                .id(message.getMessageId())
                .sender(message.getSenderEmail())
                .receivers(messageInfo.getReceivers())
                .isRead(messageInfo.isRead())
                .date(message.getSentDate())
                .encodedMessage(message.getEncryptedMessage())
                .key(messageInfo.getKey())
                .iv(message.getIv())
                .attachments(AttachmentsDTO.mapAttachmentsToAttachmentDTOs(message.getAttachments()))
                .build();
    }

    public static List<MessagesDTO> mapMessageKeyPairsToMessageDTOs(List<MessageInfo> messageInfo){
        return messageInfo.stream().map(MessagesDTO::mapMessageKeyPairToMessageDTO).toList();
    }
}
