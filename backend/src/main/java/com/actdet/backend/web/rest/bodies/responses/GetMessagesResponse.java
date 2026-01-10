package com.actdet.backend.web.rest.bodies.responses;

import com.actdet.backend.services.data.dto.MessagesDTO;
import com.actdet.backend.services.data.repositories.entities.Messages;
import lombok.Data;

import java.util.List;

@Data
public class GetMessagesResponse {
    private List<MessagesDTO> messages;

    public GetMessagesResponse(List<Messages> messages) {
        setMessages(messages);
    }

    public void setMessages(List<Messages> messages){
        this.messages = MessagesDTO.mapMessagesToMessageDTOs(messages);
    }
}
