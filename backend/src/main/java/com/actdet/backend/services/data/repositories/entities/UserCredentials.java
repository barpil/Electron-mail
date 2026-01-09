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

    @MapsId
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "userId")
    private Users user;

    private UserCredentials(String email, String username, String hashedPassword) {
        this.hashedPassword = hashedPassword;
        this.user = Users.builder()
                .email(email)
                .username(username)
                .build();
    }

    public static UserCredentials createUserRegistrationDto(String email, String username, String hashedPassword){
        return new UserCredentials(email, username, hashedPassword);
    }

    public String getEmail() {
        return user.getEmail();
    }
}
