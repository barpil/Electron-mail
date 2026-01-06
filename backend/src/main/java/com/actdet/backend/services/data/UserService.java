package com.actdet.backend.services.data;

import com.actdet.backend.services.data.repositories.UserCredentialsRepository;
import com.actdet.backend.services.data.repositories.UsersRepository;
import com.actdet.backend.services.data.repositories.entities.UserCredentials;
import com.actdet.backend.services.data.repositories.entities.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserCredentialsRepository userCredentialsRepository;
    private final UsersRepository usersRepository;

    @Autowired
    public UserService(PasswordEncoder passwordEncoder, UserCredentialsRepository userCredentialsRepository, UsersRepository usersRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userCredentialsRepository = userCredentialsRepository;
        this.usersRepository = usersRepository;
    }


    public Optional<UserCredentials> getUserCredentialsByEmail(String email){
        if(email==null) return Optional.empty();
        return userCredentialsRepository.findUserCredentialsByUser_Email(email);
    }

    public Optional<Users> getUserInfoByEmail(String email){
        if(email==null) return Optional.empty();
        return usersRepository.findUsersByEmail(email);
    }

    /*
    DO DODANIA KONTROLA DOSTEPNOSCI NAZW UZYTKOWNIKA I EMAILI Z DODATKOWYM POTIWERDZANIEM ICH PRZY REJESTRACJI
    WE FRONTENDZIE

    ORAZ BLOKADA STRON FRONTENDU PRZY NIEAKTUALNEJ SESJI


     */
    public UserCredentials registerUser(String email, String username, String password) throws DataAccessException {
        String hashedPassword = passwordEncoder.encode(password);
        UserCredentials userDto = UserCredentials.createUserRegistrationDto(email, username, hashedPassword);
        return userCredentialsRepository.save(userDto);
    }

}
