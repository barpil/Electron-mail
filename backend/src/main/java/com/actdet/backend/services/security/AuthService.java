package com.actdet.backend.services.security;

import com.actdet.backend.services.data.UserService;
import com.actdet.backend.services.data.repositories.entities.UserCredentials;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    private final UserService userService;

    @Autowired
    public AuthService(UserService userService) {
        this.userService = userService;
    }

    @Override
    @NullMarked
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserCredentials userCredentials = this.userService.getUserCredentialsByEmail(email).orElseThrow(() -> new UsernameNotFoundException(""));
        return org.springframework.security.core.userdetails.User.builder()
                .username(userCredentials.getEmail())
                .password(userCredentials.getHashedPassword())
                .roles("USER")
                .build();

    }
}
