package com.actdet.backend.services.data.repositories.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Generated;

import java.sql.Blob;
import java.sql.SQLException;

@Entity
@Table(name = "ATTACHMENTS")
public class Attachments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATTACHMENT_ID")
    private Long attachmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MESSAGE_ID", referencedColumnName = "MESSAGE_ID")
    @Setter
    private Messages message;

    @Column(name = "FILE_NAME")
    @Getter
    private String name;

    @Lob
    @Column(name = "FILE_DATA")
    @Getter
    private Blob data;

    @Column(name = "FILE_SIZE", nullable = false)
    @Getter
    private Long size;

    @PrePersist
    @PreUpdate
    private void calculateFileSize() throws SQLException {
        if (data != null) {
            long fileSize = data.length();
            if (fileSize > 5_000_000L) {
                throw new IllegalArgumentException("Attachment cannot be bigger than 5MB");
            }
            this.size = fileSize;
        } else {
            this.size = 0L;
        }
    }

    @Builder
    public Attachments(Messages message, String name, Blob data) {
        this.message = message;
        this.name = name;
        this.data = data;
    }

}
