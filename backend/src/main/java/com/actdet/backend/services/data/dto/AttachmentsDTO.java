package com.actdet.backend.services.data.dto;

import com.actdet.backend.services.data.repositories.entities.Attachments;
import lombok.Builder;

import java.util.List;

@Builder
public class AttachmentsDTO{
    Long id;
    byte[] encodedData;

    public static AttachmentsDTO mapAttachmentToAttachmentDTO(Attachments attachment){
        return AttachmentsDTO.builder()
                .id(attachment.getAttachmentId())
                .encodedData(attachment.getEncodedData())
                .build();
    }

    public static List<AttachmentsDTO> mapAttachmentsToAttachmentDTOs(List<Attachments> attachments){
        return attachments.stream().map(AttachmentsDTO::mapAttachmentToAttachmentDTO)
                .toList();
    }
}
