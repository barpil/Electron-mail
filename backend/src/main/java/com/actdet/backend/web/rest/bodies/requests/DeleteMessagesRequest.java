package com.actdet.backend.web.rest.bodies.requests;

import lombok.Data;

import java.util.List;

@Data
public class DeleteMessagesRequest {
    private List<Long> messageIdsToDelete;
}
