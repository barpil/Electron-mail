package com.actdet.backend.services.data.repositories.entities;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;

@Entity(name = "USERS")
@NoArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "USER_ID")
    @Getter
    private String userId;

    @Getter
    @Column(name = "EMAIL", nullable = false, unique = true, length = 50)
    private String email;
    @Getter
    @Column(name = "USERNAME", nullable = false, unique = true, length = 50)
    private String username;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @Setter
    private TfaCredentials tfaCredentials;

    @Builder
    public Users(String email, String username) {
        this.email = email;
        this.username = username;
    }

    public void addTfaCredentials(TfaCredentials creds) {
        this.tfaCredentials = creds;
        creds.setUser(this);
    }

}
