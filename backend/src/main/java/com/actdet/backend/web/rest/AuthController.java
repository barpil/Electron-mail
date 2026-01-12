package com.actdet.backend.web.rest;

import com.actdet.backend.services.data.UserService;
import com.actdet.backend.web.rest.bodies.requests.AvailabilityRequest;
import com.actdet.backend.web.rest.bodies.requests.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> checkSession(){
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/register", consumes = "application/x-msgpack")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        userService.registerUser(request.getEmail(), request.getUsername(), request.getPassword(),
                request.getPublic_key(), request.getEncrypted_private_key(), request.getSalt(), request.getIv());
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/availability/username", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> isUsernameAvailable(@ModelAttribute AvailabilityRequest request){
        return userService.isUsernameAvailable(request.getValue()) ?
                ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PostMapping(value = "/availability/email", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> isEmailAvailable(@ModelAttribute AvailabilityRequest request){
        return userService.isEmailAvailable(request.getValue()) ?
                ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

}
