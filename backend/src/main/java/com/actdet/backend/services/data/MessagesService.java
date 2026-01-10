package com.actdet.backend.services.data;

import com.actdet.backend.services.data.repositories.MessagesRepository;
import com.actdet.backend.services.data.repositories.entities.Messages;
import com.actdet.backend.services.data.repositories.entities.Users;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagesService {

    private MessagesRepository messagesRepository;
    private UserService userService;



    @Autowired
    public MessagesService(MessagesRepository messagesRepository, UserService userService) {
        this.messagesRepository = messagesRepository;
        this.userService = userService;
    }

    public List<Messages> getMessagesByReceiverEmail(String email) {
        return messagesRepository.getMessagesByReceiver_EmailAndIsDeletedByReceiverFalse(email);
    }

    public List<Messages> getMessagesBySenderEmail(String email) {
        return messagesRepository.getMessagesBySender_EmailAndIsDeletedBySenderFalse(email);
    }


    public void sendMessage(String senderEmail, String receiverEmail, byte[] encodedMessage,
                            byte[] key, byte[] iv) {
        Users sender = userService.getUserInfoByEmail(senderEmail)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));
        Users receiver = userService.getUserInfoByEmail(receiverEmail)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        Messages message = Messages.builder()
                .sender(sender)
                .receiver(receiver)
                .encryptedMessage(encodedMessage)
                .key(key)
                .iv(iv)
                .build();

        messagesRepository.save(message);
    }

    @Transactional
    public void deleteMessages(String subjectsEmail, List<Long> messageIds) {
        List<Messages> messages = messagesRepository.findAllById(messageIds);
        messages.forEach(message -> {
            if (message.getReceiverEmail().equals(subjectsEmail)) {
                message.setDeletedByReceiver(true);
            } else if (message.getSenderEmail().equals(subjectsEmail)) {
                message.setDeletedBySender(true);
                //Przypadek skrajny jezeli sami do siebie wyslemy wiadomosc
                if(message.getReceiverEmail().equals(message.getSenderEmail())) message.setDeletedByReceiver(true);
            } else {
                throw new IllegalArgumentException("User does not have permission to specified message");
            }
        });
        messagesRepository.saveAll(messages);
    }

}
