package com.actdet.backend.web.rest.bodies.requests;

import com.actdet.backend.services.data.dto.MessageKeysInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private List<MessageKeysInfo> messageKeysInfos;
    private byte[] encryptedMessage;
    private byte[] iv;
}
