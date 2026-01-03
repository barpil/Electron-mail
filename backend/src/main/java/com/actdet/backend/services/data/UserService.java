package com.actdet.backend.services.data;

import com.actdet.backend.services.data.entities.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {


    public Optional<User> findUserByEmail(String email){
        //dummy method

        if(email.equals("admin@electron.pl")){
            User dummyUser = new User();
            dummyUser.setEmail("admin@electron.pl");
            dummyUser.setUsername("admin-electrona");
            dummyUser.setPassword("password");
            return Optional.of(dummyUser);
        }
        return Optional.empty();
    }

}
