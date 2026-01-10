package com.actdet.backend.web.rest.bodies.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String receiverEmail;
    private byte[] encryptedMessage;
    private byte[] key;
    private byte[] iv;
}
