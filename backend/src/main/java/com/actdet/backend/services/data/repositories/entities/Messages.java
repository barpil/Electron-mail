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

    @Column(name = "SENT_DATE")
    @Generated
    @Getter
    private LocalDateTime sentDate;

    @Column(name = "ENCRYPTED_MESSAGE")
    @Getter
    private byte[] encryptedMessage;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter
    @Setter
    private List<MessageReceivers> receivers = new ArrayList<>();


    @Column(name = "IV")
    @Getter
    private byte[] iv;


    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter
    @Setter
    private List<Attachments> attachments = new ArrayList<>();

    @Builder
    public Messages(List<Attachments> attachments, Users sender, byte[] encryptedMessage, byte[] iv, List<MessageReceivers> messageReceivers) {
        this.attachments = attachments;
        this.sender = sender;
        this.encryptedMessage = encryptedMessage;
        this.iv = iv;
        this.receivers = messageReceivers;
    }


    public String getSenderEmail(){return this.sender.getEmail();}
}
