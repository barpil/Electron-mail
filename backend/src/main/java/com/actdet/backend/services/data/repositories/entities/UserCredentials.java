package com.actdet.backend.services.data.repositories.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Generated;

@Entity(name = "USER_CREDENTIALS")
@NoArgsConstructor
public class UserCredentials {

    @Id
    @Generated
    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "PASSWORD", nullable = false, length = 128)
    @Getter
    private String hashedPassword;

    @Column(name = "USER_PUBLIC_KEY")
    @Getter
    private byte[] rsaPublicKey;

    @Column(name = "USER_ENCRYPTED_PRIVATE_KEY")
    @Getter
    private byte[] encryptedRsaPrivateKey;

    @Column(name = "KEY_ENCRYPTION_SALT")
    @Getter
    private byte[] keyEncryptionSalt;

    @Column(name = "KEY_ENCRYPTION_IV")
    @Getter
    private byte[] keyEncryptionIV;


    @MapsId
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "userId")
    private Users user;

    private UserCredentials(String email, String username, String hashedPassword, byte[] rsaPublicKey,
                            byte[] encryptedRsaPrivateKey, byte[] keyEncryptionSalt, byte[] keyEncryptionIV) {
        this.hashedPassword = hashedPassword;
        this.rsaPublicKey = rsaPublicKey;
        this.encryptedRsaPrivateKey = encryptedRsaPrivateKey;
        this.keyEncryptionSalt = keyEncryptionSalt;
        this.keyEncryptionIV = keyEncryptionIV;
        this.user = Users.builder()
                .email(email)
                .username(username)
                .build();
    }

    public static UserCredentials createUserRegistrationDto(String email, String username, String hashedPassword, byte[] rsaPublicKey,
                                                            byte[] encryptedRsaPrivateKey, byte[] keyEncryptionSalt, byte[] keyEncryptionIV){
        return new UserCredentials(email, username, hashedPassword, rsaPublicKey, encryptedRsaPrivateKey,
                keyEncryptionSalt, keyEncryptionIV);
    }

    public String getEmail() {
        return user.getEmail();
    }
}
