package com.actdet.backend.web.rest.bodies.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TFACodeRequest {
    private Integer code;
}
