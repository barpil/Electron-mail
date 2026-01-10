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
    String receiver;
    LocalDateTime date;
    boolean isRead;

    byte[] encodedMessage;
    byte[] key;
    byte[] iv;
    List<AttachmentsDTO> attachments;


    public static MessagesDTO mapMessageToMessageDTO(Messages message){
        return MessagesDTO.builder()
                .id(message.getMessageId())
                .sender(message.getSenderEmail())
                .receiver(message.getReceiverEmail())
                .date(message.getSentDate())
                .encodedMessage(message.getEncryptedMessage())
                .key(message.getKey())
                .iv(message.getIv())
                .attachments(AttachmentsDTO.mapAttachmentsToAttachmentDTOs(message.getAttachments()))
                .build();
    }

    public static List<MessagesDTO> mapMessagesToMessageDTOs(List<Messages> messages){
        return messages.stream().map(MessagesDTO::mapMessageToMessageDTO).toList();
    }
}
