package com.actdet.backend.web.rest.bodies.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetEncryptionDataResponse {
    private byte[] encryptedKey;
    private byte[] salt;
    private byte[] iv;
}
