package com.actdet.backend.web.rest.bodies.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NonNull
    private String email;
    @NonNull
    private String username;
    @NonNull
    private String password;
    @NonNull
    private byte[] public_key;
    @NonNull
    private byte[] encrypted_private_key;
    @NonNull
    private byte[] salt;
    @NonNull
    private byte[] iv;
}
