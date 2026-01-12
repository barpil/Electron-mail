package com.actdet.backend.services.data.dto;

public record MessageKeysInfo(String email, byte[] key, boolean isSender, boolean isReceiver) {
}
