package com.actdet.backend.services.data.repositories.entities.ids;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MessageReceiversId implements Serializable {
    @Column(name = "MESSAGE_ID")
    private Long messageId;

    @Column(name = "RECEIVER_ID")
    private String receiverId;
}
