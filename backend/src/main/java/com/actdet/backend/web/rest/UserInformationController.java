package com.actdet.backend.web.rest;

import com.actdet.backend.services.data.UserService;
import com.actdet.backend.web.rest.bodies.GetUserInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserInformationController {

    private final UserService userService;

    @Autowired
    public UserInformationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getCurrentUserUsername(Principal principal){
        var opt = userService.findUserByEmail(principal.getName());
        return opt.isPresent() ? ResponseEntity.ok(GetUserInfoResponse.builder().username(opt.get().getUsername()).build())
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
