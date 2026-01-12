package com.actdet.backend.web.rest;

import com.actdet.backend.services.data.UserService;
import com.actdet.backend.web.rest.bodies.responses.GetEncryptionDataResponse;
import com.actdet.backend.web.rest.bodies.responses.GetKeyResponse;
import com.actdet.backend.web.rest.bodies.responses.GetUserInfoResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserInformationController {

    private final UserService userService;
    private final ObjectMapper msgPackMapper;

    @Autowired
    public UserInformationController(UserService userService, @Qualifier("messagePackObjectMapper") ObjectMapper msgPackMapper) {
        this.userService = userService;
        this.msgPackMapper = msgPackMapper;
    }

    @GetMapping
    public ResponseEntity<?> getCurrentUserInfo(Principal principal) {
        var opt = userService.getUserInfoByEmail(principal.getName());
        return opt.isPresent() ? ResponseEntity.ok(GetUserInfoResponse.builder()
                .username(opt.get().getUsername())
                .email(opt.get().getEmail())
                .build())
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping(value = "/key")
    public ResponseEntity<?> getCurrentUsersPrivateKey(Principal principal) throws JsonProcessingException {
        var optKey = userService.getEncryptionDataByUserEmail(principal.getName());
        if (optKey.isPresent()) {
            var response = new GetEncryptionDataResponse(optKey.get().encryptedPrivateKey(), optKey.get().salt(), optKey.get().iv());
            byte[] msgPackResponse = msgPackMapper.writeValueAsBytes(response);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).body(msgPackResponse);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping(value = "/{email}/key")
    public ResponseEntity<?> getUsersPublicKey(@PathVariable String email) throws JsonProcessingException {
        var optKey = userService.getPublicKeyByEmail(email);
        if (optKey.isPresent()) {
            var response = new GetKeyResponse(optKey.get());
            byte[] msgPackResponse = msgPackMapper.writeValueAsBytes(response);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).body(msgPackResponse);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

}
