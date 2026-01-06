package com.actdet.backend.services.data.repositories.entities;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Generated;

@Entity(name = "USERS")
@NoArgsConstructor
public class Users {

    @Id
    @Generated
    @Column(name = "USER_ID")
    String userId;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 50)
    private String email;
    @Column(name = "USERNAME", nullable = false, unique = true, length = 50)
    private String username;

    @Builder
    public Users(String email, String username) {
        this.email = email;
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }
}
