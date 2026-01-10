package com.actdet.backend.services.data.repositories.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ATTACHMENTS")
@NoArgsConstructor
public class Attachments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATTACHMENT_ID")
    @Getter
    private Long attachmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MESSAGE_ID", referencedColumnName = "MESSAGE_ID")
    @Setter
    private Messages message;

    @Column(name = "ENCODED_DATA")
    @Getter
    private byte[] encodedData;

    @Builder
    public Attachments(Messages message, byte[] encodedData) {
        this.message = message;
        this.encodedData = encodedData;
    }

}
