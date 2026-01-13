package com.actdet.backend.services.tfa;

import com.actdet.backend.services.data.TfaCredentialsService;
import com.actdet.backend.services.data.repositories.entities.Users;
import com.actdet.backend.services.security.AesGcmEncryptionService;
import com.actdet.backend.services.tfa.exceptions.Invalid2FACodeException;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.HmacHashFunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class TwoFactoryAuthService {

    private final TfaCredentialsService tfaCredentialsService;
    private final AesGcmEncryptionService aesGcmEncryptionService;

    private final String ISSUER = "Electron";
    private final GoogleAuthenticator googleAuthenticator;
    @Autowired
    public TwoFactoryAuthService(TfaCredentialsService tfaCredentialsService, AesGcmEncryptionService aesGcmEncryptionService) {
        this.tfaCredentialsService = tfaCredentialsService;
        this.aesGcmEncryptionService = aesGcmEncryptionService;
        var config = new GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder()
                .setCodeDigits(6)
                .setHmacHashFunction(HmacHashFunction.HmacSHA1)
                .setWindowSize(2) // Zeby 30 sekund po zmianie kodu rowniez dzialal
                .build();
        this.googleAuthenticator = new GoogleAuthenticator(config);
    }

    //Zwraca otpauth uri
    public void create2FACredentials(Users user){
        GoogleAuthenticatorKey key = this.googleAuthenticator.createCredentials();
        this.tfaCredentialsService.save2FACredentials(user,
                aesGcmEncryptionService.encrypt(key.getKey()));
    }


    public String getTotAuthURIString(String email){
        String key = getDecryptedKeyForUser(email);
        return UriComponentsBuilder.newInstance()
                .scheme("otpauth")
                .host("totp")
                .pathSegment(ISSUER + ":" + email)
                .queryParam("secret", key)
                .queryParam("issuer", ISSUER)
                .queryParam("algorithm", "SHA1")
                .queryParam("digits", 6)
                .build().toUriString();
    }

    public boolean checkIf2FAIsEnabled(String email){
        return this.tfaCredentialsService.checkIf2FAIsEnabled(email);
    }


    public void verifyAndEnable2FA(String email, int code){
        if(verifyCode(email, code)){
            this.tfaCredentialsService.mark2faAsEnabled(email);
        }else{
            throw new Invalid2FACodeException();
        }
    }

    public void verify(String email, int code){
        if(!verifyCode(email, code)){
            throw new Invalid2FACodeException();
        }
    }

    private boolean verifyCode(String email, int code){
        String secretKey = getDecryptedKeyForUser(email);
        return this.googleAuthenticator.authorize(secretKey, code);
    }

    private String getDecryptedKeyForUser(String email){
        return this.aesGcmEncryptionService.decrypt(
                this.tfaCredentialsService.getEncryptedSecretKeyForUser(email));
    }
}
