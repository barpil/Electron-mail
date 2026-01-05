package com.actdet.backend.services.security;

import com.actdet.backend.services.data.UserService;
import com.actdet.backend.services.data.entities.User;
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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = this.userService.findUserByEmail(username).orElseThrow(() -> new UsernameNotFoundException(""));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password("{noop}"+user.getPassword()) //{noop} sprawia ze nie trzeba szyfrowac hasla (tymczasowo do testow)
                .roles("USER")
                .build();

    }
}
