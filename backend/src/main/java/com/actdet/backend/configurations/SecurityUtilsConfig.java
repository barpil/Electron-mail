package com.actdet.backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityUtilsConfig {

    @Bean
    public PasswordEncoder encoder() {
        //Argon2id
        //salt length 16 bytes, hash length 32 bytes, parallelism of 1, memory cost 16MiB,  2 iterations.
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }
}
