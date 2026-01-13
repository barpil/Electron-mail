package com.actdet.backend.services.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
public class AesGcmEncryptionService {

    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;

    private final SecretKey key;
    private final SecureRandom secureRandom = new SecureRandom();

    public AesGcmEncryptionService(@Value("${TFA_AES_KEY:standard_key}") String keyValue) {
        if(!Stream.of(16,24,32).anyMatch(x -> x==keyValue.length())) {
            throw new RuntimeException("Invalid AES key length. 2FA_AES_KEY must have 16, 24 or 32 chracters");
        }
        this.key = new SecretKeySpec(
                keyValue.getBytes(StandardCharsets.UTF_8),
                "AES"
        );
    }

    public byte[] encrypt(String text) {
        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(TAG_LENGTH, iv));

            byte[] encrypted = cipher.doFinal(
                    text.getBytes(StandardCharsets.UTF_8)
            );

            ByteBuffer buffer = ByteBuffer.allocate(iv.length + encrypted.length);
            buffer.put(iv);
            buffer.put(encrypted);

            return buffer.array();
        } catch (Exception e) {
            throw new IllegalStateException("Encryption failed", e);
        }
    }

    public String decrypt(byte[] encryptedBytes) {
        try {
            ByteBuffer buffer = ByteBuffer.wrap(encryptedBytes);

            byte[] iv = new byte[IV_LENGTH];
            buffer.get(iv);

            byte[] cipherText = new byte[buffer.remaining()];
            buffer.get(cipherText);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(TAG_LENGTH, iv));

            byte[] decrypted = cipher.doFinal(cipherText);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Decryption failed", e);
        }
    }
}
