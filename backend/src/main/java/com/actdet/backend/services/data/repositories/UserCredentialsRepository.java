package com.actdet.backend.services.data.repositories;

import com.actdet.backend.services.data.repositories.entities.UserCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCredentialsRepository extends JpaRepository<UserCredentials, String> {
    Optional<UserCredentials> findUserCredentialsByUser_Email(String userEmail);
}
