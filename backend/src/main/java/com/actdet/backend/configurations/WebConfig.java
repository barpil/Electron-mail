package com.actdet.backend.configurations;

import com.actdet.backend.configurations.converters.MessagePackHttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
class WebConfig implements WebMvcConfigurer {

    @Bean
    public HttpMessageConverter<Object> messagePackConverter(@Qualifier("messagePackObjectMapper") ObjectMapper msgPackObjectMapper){
        return new MessagePackHttpMessageConverter(msgPackObjectMapper);
    }
}