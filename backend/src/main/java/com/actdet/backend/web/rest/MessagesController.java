package com.actdet.backend.web.rest;

import com.actdet.backend.services.data.MessagesService;
import com.actdet.backend.services.data.repositories.entities.Messages;
import com.actdet.backend.web.rest.bodies.requests.DeleteMessagesRequest;
import com.actdet.backend.web.rest.bodies.requests.SendMessageRequest;
import com.actdet.backend.web.rest.bodies.responses.GetMessagesResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.msgpack.jackson.dataformat.MessagePackFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessagesController {

    private MessagesService messagesService;

    private final ObjectMapper msgPackMapper;

    @Autowired
    public MessagesController(MessagesService messagesService, @Qualifier("messagePackObjectMapper") ObjectMapper msgPackMapper) {
        this.messagesService = messagesService;
        this.msgPackMapper = msgPackMapper;
    }

    @GetMapping(value = "/received", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<?> getReceivedMessages(Principal principal) throws JsonProcessingException {
        List<Messages> messagesList = this.messagesService.getMessagesByReceiverEmail(principal.getName());
        GetMessagesResponse getMessagesResponse = new GetMessagesResponse(messagesList);

        byte[] msgPackResponse = msgPackMapper.writeValueAsBytes(getMessagesResponse);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).body(msgPackResponse);
    }

    @GetMapping(value = "/sent", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<?> getSentMessages(Principal principal) throws JsonProcessingException {
        List<Messages> messagesList = this.messagesService.getMessagesBySenderEmail(principal.getName());
        GetMessagesResponse getMessagesResponse = new GetMessagesResponse(messagesList);

        byte[] msgPackResponse = msgPackMapper.writeValueAsBytes(getMessagesResponse);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).body(msgPackResponse);
    }


    @PostMapping(value = "/send", consumes = "application/x-msgpack")
    public ResponseEntity<?> sendMessage(Principal principal, @RequestBody SendMessageRequest request) {
        try {
            this.messagesService.sendMessage(principal.getName(), request.getReceiverEmail(),
                    request.getEncryptedMessage(), request.getKey(), request.getIv());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMessages(Principal principal, @ModelAttribute DeleteMessagesRequest request) {
        try {
            this.messagesService.deleteMessages(principal.getName(), request.getMessageIdsToDelete());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
