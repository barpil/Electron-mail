package com.actdet.backend.configurations.converters;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class MessagePackHttpMessageConverter extends AbstractHttpMessageConverter<Object> {

    private final ObjectMapper msgPackObjectMapper;

    public MessagePackHttpMessageConverter(ObjectMapper msgPackObjectMapper) {
        //Typy dla msgpacka
        super(
                new MediaType("application", "x-msgpack"),
                new MediaType("application", "x-msgpack", StandardCharsets.UTF_8)
        );
        this.msgPackObjectMapper = msgPackObjectMapper;
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        //Po prostu wszystkie
        return true;
    }

    @Override
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        return this.msgPackObjectMapper.readValue(inputMessage.getBody(), clazz);
    }

    @Override
    protected void writeInternal(Object o, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        this.msgPackObjectMapper.writeValue(outputMessage.getBody(), o);
    }
}
