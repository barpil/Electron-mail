package com.actdet.backend.services.data.repositories.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(schema = "MESSAGES")
@NoArgsConstructor
public class Messages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MESSAGE_ID")
    private Long messageId;

    @ManyToOne
    @JoinColumn(name = "SENDER_ID", referencedColumnName = "USER_ID", nullable = false)
    private Users sender;

    @ManyToOne
    @JoinColumn(name = "RECEIVER_ID", referencedColumnName = "USER_ID", nullable = false)
    private Users receiver;

    @Column(name = "MESSAGE_SUBJECT", length = 100, nullable = false)
    private String subject;
    @Column(name = "MESSAGE_TEXT", length = 2048)
    private String text;

    @Generated
    @Column(name = "DELETED_BY_SENDER", insertable = false)
    @Setter
    private boolean isDeletedBySender;
    @Generated
    @Column(name = "DELETED_BY_RECEIVER", insertable = false)
    @Setter
    private boolean isDeletedByReceiver;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Getter
    @Setter
    private List<Attachments> attachments = new ArrayList<>();

    @Builder
    public Messages(List<Attachments> attachments, Users sender, Users receiver, String subject, String text) {
        this.attachments = attachments;
        this.sender = sender;
        this.receiver = receiver;
        this.subject = subject;
        this.text = text;
    }


}
