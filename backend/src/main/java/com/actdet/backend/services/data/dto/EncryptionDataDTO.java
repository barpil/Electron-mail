package com.actdet.backend.services.data.dto;

public record EncryptionDataDTO(
        byte[] encryptedPrivateKey,
        byte[] salt,
        byte[] iv
) {}
