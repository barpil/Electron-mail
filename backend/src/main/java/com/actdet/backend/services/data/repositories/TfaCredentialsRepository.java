package com.actdet.backend.services.data.repositories;

import com.actdet.backend.services.data.repositories.entities.TfaCredentials;
import com.actdet.backend.services.data.repositories.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TfaCredentialsRepository extends JpaRepository<TfaCredentials, String> {
    Optional<TfaCredentials> findByUser_Email(String userEmail);
}
