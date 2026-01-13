package com.actdet.backend.services.data;

import com.actdet.backend.services.data.repositories.TfaCredentialsRepository;
import com.actdet.backend.services.data.repositories.UsersRepository;
import com.actdet.backend.services.data.repositories.entities.TfaCredentials;
import com.actdet.backend.services.data.repositories.entities.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TfaCredentialsService {
    private final UsersRepository usersRepository;
    private final TfaCredentialsRepository tfaCredentialsRepository;

    @Autowired
    public TfaCredentialsService(TfaCredentialsRepository tfaCredentialsRepository, UsersRepository usersRepository) {
        this.tfaCredentialsRepository = tfaCredentialsRepository;
        this.usersRepository = usersRepository;
    }


    public void save2FACredentials(Users user, byte[] encryptedSecretKey){
        var cred = new TfaCredentials(user, false, encryptedSecretKey);
        user.setTfaCredentials(cred);
        this.tfaCredentialsRepository.save(cred);
    }

    public byte[] getEncryptedSecretKeyForUser(String email){
        return this.tfaCredentialsRepository.findByUser_Email(email)
                .orElseThrow(() -> new IllegalArgumentException("2FA credentials do not exist for specified user"))
                .getEncryptedSecretKey();
    }

    public void mark2faAsEnabled(String email){
        var cred = this.tfaCredentialsRepository.findByUser_Email(email)
                .orElseThrow(() -> new IllegalArgumentException("2FA credentials do not exist for specified user"));
        cred.setTfaEnabled(true);
        this.tfaCredentialsRepository.save(cred);
    }

    public boolean checkIf2FAIsEnabled(String email){
        var cred = this.tfaCredentialsRepository.findByUser_Email(email)
                .orElseThrow(() -> new IllegalArgumentException("2FA credentials do not exist for specified user"));
        return cred.isTfaEnabled();
    }
}
