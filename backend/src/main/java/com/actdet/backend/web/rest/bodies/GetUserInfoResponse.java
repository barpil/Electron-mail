package com.actdet.backend.web.rest.bodies;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetUserInfoResponse {
    private String username;
}
