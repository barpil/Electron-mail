package com.actdet.backend.services.data.repositories.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "MESSAGES")
@NoArgsConstructor
public class Messages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MESSAGE_ID")
    @Getter
    private Long messageId;

    @ManyToOne
    @JoinColumn(name = "SENDER_ID", referencedColumnName = "USER_ID", nullable = false)
    private Users sender;

    @ManyToOne
    @JoinColumn(name = "RECEIVER_ID", referencedColumnName = "USER_ID", nullable = false)
    private Users receiver;

    @Column(name = "SENT_DATE")
    @Generated
    @Getter
    private LocalDateTime sentDate;

    @Column(name = "ENCRYPTED_MESSAGE")
    @Getter
    private byte[] encryptedMessage;

    @Column(name = "ENCRYPTION_KEY")
    @Getter
    private byte[] key;

    @Column(name = "IV")
    @Getter
    private byte[] iv;

    @Column(name = "MESSAGE_READ")
    @Getter
    @Setter
    private boolean read;

    @Generated
    @Column(name = "DELETED_BY_SENDER", insertable = false)
    @Setter
    @Getter
    private boolean isDeletedBySender;
    @Generated
    @Column(name = "DELETED_BY_RECEIVER", insertable = false)
    @Setter
    @Getter
    private boolean isDeletedByReceiver;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Getter
    @Setter
    private List<Attachments> attachments = new ArrayList<>();

    @Builder
    public Messages(List<Attachments> attachments, Users sender, Users receiver, byte[] encryptedMessage, byte[] key, byte[] iv) {
        this.attachments = attachments;
        this.sender = sender;
        this.receiver = receiver;
        this.encryptedMessage = encryptedMessage;
        this.key = key;
        this.iv = iv;
        this.read = false;
    }


    public String getReceiverEmail(){return this.receiver.getEmail();}
    public String getSenderEmail(){return this.sender.getEmail();}
}
