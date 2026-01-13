package com.actdet.backend.web.rest;

import com.actdet.backend.services.data.UserService;
import com.actdet.backend.services.tfa.TwoFactoryAuthService;
import com.actdet.backend.services.tfa.exceptions.Invalid2FACodeException;
import com.actdet.backend.web.rest.bodies.requests.AvailabilityRequest;
import com.actdet.backend.web.rest.bodies.requests.RegisterRequest;
import com.actdet.backend.web.rest.bodies.responses.BooleanResponse;
import com.actdet.backend.web.rest.bodies.responses.TotAuthPathResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final TwoFactoryAuthService twoFactoryAuthService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService,
                          TwoFactoryAuthService twoFactoryAuthService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.twoFactoryAuthService = twoFactoryAuthService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> checkSession() {
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/register", consumes = "application/x-msgpack")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        userService.registerUser(request.getEmail(), request.getUsername(), request.getPassword(),
                request.getPublic_key(), request.getEncrypted_private_key(), request.getSalt(), request.getIv());
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/availability/username", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> isUsernameAvailable(@ModelAttribute AvailabilityRequest request) {
        return userService.isUsernameAvailable(request.getValue()) ?
                ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PostMapping(value = "/availability/email", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> isEmailAvailable(@ModelAttribute AvailabilityRequest request) {
        return userService.isEmailAvailable(request.getValue()) ?
                ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @GetMapping(value = "/2fa/status")
    public ResponseEntity<?> is2FAConfigured(Principal principal) {
        return ResponseEntity.ok(new BooleanResponse(this.twoFactoryAuthService.checkIf2FAIsEnabled(principal.getName())));
    }

    @GetMapping(value = "/2fa/qr")
    public ResponseEntity<?> getTotPath(Principal principal) {
        return ResponseEntity.ok(
                new TotAuthPathResponse(this.twoFactoryAuthService.getTotAuthURIString(principal.getName()))
        );
    }


    @PostMapping(value = "/2fa", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> verify2FA(HttpServletRequest request, Principal principal, @RequestParam(name = "code") Integer code,
                                       @RequestParam(name = "setup", required = false, defaultValue = "false") boolean firstTime) {
        try{
            if (firstTime) {
                this.twoFactoryAuthService.verifyAndEnable2FA(principal.getName(), code);
            }else{
                this.twoFactoryAuthService.verify(principal.getName(), code);
            }
        }catch(Invalid2FACodeException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        var session = request.getSession(false);
        if(session!=null){
            session.setAttribute("2FA_AUTHENTICATED", true);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}
