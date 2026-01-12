package com.actdet.backend.services.data.dto;

import com.actdet.backend.services.data.repositories.entities.MessageReceivers;
import com.actdet.backend.services.data.repositories.entities.Messages;

import java.util.List;

public interface MessageInfo {
    Messages getMessage();
    boolean isRead();
    byte[] getKey();
    default List<String> getReceivers() {
        return getMessage().getReceivers().stream()
                .filter(MessageReceivers::isReceiver)
                .map(mr -> mr.getReceiver().getEmail())
                .toList();
    }
}
