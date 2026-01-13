package com.actdet.backend.services.data.repositories.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TFA_CREDENTIALS")
@NoArgsConstructor
public class TfaCredentials {
    @Id
    @Column(name = "USER_ID")
    private String userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "USER_ID")
    @Setter
    private Users user;

    @Column(name = "TFA_ENABLED")
    @Getter
    @Setter
    private boolean tfaEnabled;

    @Column(name = "ENCRYPTED_SECRET_KEY")
    @Getter
    @Setter
    private byte[] encryptedSecretKey;

    public TfaCredentials(Users user, boolean tfaEnabled, byte[] encryptedSecretKey) {
        this.user = user;
        this.tfaEnabled = tfaEnabled;
        this.encryptedSecretKey = encryptedSecretKey;
    }
}
