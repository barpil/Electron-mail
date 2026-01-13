package com.actdet.backend.services.data;

import com.actdet.backend.services.data.dto.EncryptionDataDTO;
import com.actdet.backend.services.data.repositories.UserCredentialsRepository;
import com.actdet.backend.services.data.repositories.UsersRepository;
import com.actdet.backend.services.data.repositories.entities.UserCredentials;
import com.actdet.backend.services.data.repositories.entities.Users;
import com.actdet.backend.services.tfa.TwoFactoryAuthService;
import jakarta.transaction.Transactional;
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

    private final TwoFactoryAuthService twoFactoryAuthService;

    @Autowired
    public UserService(PasswordEncoder passwordEncoder, UserCredentialsRepository userCredentialsRepository,
                       UsersRepository usersRepository, TwoFactoryAuthService twoFactoryAuthService) {
        this.passwordEncoder = passwordEncoder;
        this.userCredentialsRepository = userCredentialsRepository;
        this.usersRepository = usersRepository;
        this.twoFactoryAuthService = twoFactoryAuthService;
    }


    public Optional<UserCredentials> getUserCredentialsByEmail(String email){
        if(email==null) return Optional.empty();
        return userCredentialsRepository.findUserCredentialsByUser_Email(email);
    }

    public Optional<Users> getUserInfoByEmail(String email){
        if(email==null) return Optional.empty();
        return usersRepository.findUsersByEmail(email);
    }

    public boolean isUsernameAvailable(String username){
        if(username==null) return false;
        return !usersRepository.existsByUsername(username);
    }

    public boolean isEmailAvailable(String email){
        if(email==null) return false;
        return !usersRepository.existsByEmail(email);
    }

    public Optional<EncryptionDataDTO> getEncryptionDataByUserEmail(String email) {
        if(email==null) return Optional.empty();
        var opt = userCredentialsRepository.findUserCredentialsByUser_Email(email);
        return opt.map(userCredentials ->
                new EncryptionDataDTO(userCredentials.getEncryptedRsaPrivateKey(), userCredentials.getKeyEncryptionSalt(),
                        userCredentials.getKeyEncryptionIV()));
    }


    public Optional<byte[]> getPublicKeyByEmail(String email){
        if(email==null) return Optional.empty();
        var opt = userCredentialsRepository.findUserCredentialsByUser_Email(email);
        return opt.map(UserCredentials::getRsaPublicKey);
    }

    /*
    DO DODANIA KONTROLA DOSTEPNOSCI NAZW UZYTKOWNIKA I EMAILI Z DODATKOWYM POTIWERDZANIEM ICH PRZY REJESTRACJI
    WE FRONTENDZIE
     */
    @Transactional
    public UserCredentials registerUser(String email, String username, String password, byte[] rsaPublicKey,
                                        byte[] encryptedRsaPrivateKey, byte[] encryptionSalt, byte[] encryptionIV) throws DataAccessException {
        String hashedPassword = passwordEncoder.encode(password);
        UserCredentials userDto = UserCredentials.createUserRegistrationDto(email, username, hashedPassword, rsaPublicKey,
                encryptedRsaPrivateKey, encryptionSalt, encryptionIV);

        UserCredentials userCredentials = userCredentialsRepository.saveAndFlush(userDto);
        this.twoFactoryAuthService.create2FACredentials(userCredentials.getUser());
        return userCredentials;
    }

}




