package com.actdet.backend.services.data.repositories;

import com.actdet.backend.services.data.repositories.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, String> {
    Optional<Users> findUsersByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
