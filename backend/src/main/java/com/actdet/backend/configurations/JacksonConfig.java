package com.actdet.backend.configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.msgpack.jackson.dataformat.MessagePackFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class JacksonConfig {

    //Object mapper wykorzystujacy msgpacka
    @Bean(name = "messagePackObjectMapper")
    public ObjectMapper messagePackObjectMapper(){
        ObjectMapper objectMapper = new ObjectMapper(new MessagePackFactory());
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}
