package com.actdet.backend.services.tfa.exceptions;

public class Invalid2FACodeException extends RuntimeException {
    public Invalid2FACodeException() {
        super("Specified 2FA code was incorrect");
    }
}
