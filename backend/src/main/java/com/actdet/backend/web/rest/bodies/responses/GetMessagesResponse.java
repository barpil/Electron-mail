package com.actdet.backend.web.rest.bodies.responses;

import com.actdet.backend.services.data.dto.MessagesDTO;
import lombok.Data;

import java.util.List;

@Data
public class GetMessagesResponse {
    private List<MessagesDTO> messages;

    public GetMessagesResponse(List<MessagesDTO> messages) {
        setMessages(messages);
    }

}
