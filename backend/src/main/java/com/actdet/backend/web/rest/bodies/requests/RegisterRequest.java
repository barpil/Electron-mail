package com.actdet.backend.web.rest.bodies.requests;

import lombok.Data;
import lombok.NonNull;

@Data
public class RegisterRequest {
    @NonNull
    private String email;
    @NonNull
    private String username;
    @NonNull
    private String password;
}
