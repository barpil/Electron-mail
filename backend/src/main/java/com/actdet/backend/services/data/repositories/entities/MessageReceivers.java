package com.actdet.backend.services.data.repositories.entities;

import com.actdet.backend.services.data.repositories.entities.ids.MessageReceiversId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;

@Entity
@Table(name = "MESSAGE_RECEIVERS")
@NoArgsConstructor
public class MessageReceivers {

    @EmbeddedId
    private MessageReceiversId msrId;

    @ManyToOne
    @MapsId("messageId")
    @JoinColumn(name = "MESSAGE_ID")
    private Messages message;

    @ManyToOne
    @MapsId("receiverId")
    @JoinColumn(name = "RECEIVER_ID")
    @Getter
    private Users receiver;

    @Column(name = "IS_SENDER", nullable = false)
    private boolean isSender;

    @Column(name = "IS_RECEIVER", nullable = false)
    private boolean isReceiver;


    @Column(name = "MESSAGE_READ")
    @Generated
    @Getter
    @Setter
    private boolean read;


    @Column(name = "ENCRYPTED_ENCRYPTION_KEY", nullable = false)
    private byte[] encryptedEncryptionKey;


    public boolean isSender() {
        return isSender;
    }

    public boolean isReceiver() {
        return isReceiver;
    }

    public MessageReceivers(Messages message, Users receiver, boolean isSender, boolean isReceiver, byte[] encryptedEncryptionKey) {
        this.message = message;
        this.receiver = receiver;
        this.isSender = isSender;
        this.isReceiver = isReceiver;
        this.msrId = new MessageReceiversId(message.getMessageId(), receiver.getUserId());
        this.encryptedEncryptionKey = encryptedEncryptionKey;
    }
}

