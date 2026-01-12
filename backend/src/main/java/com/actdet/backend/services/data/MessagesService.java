package com.actdet.backend.services.data;

import com.actdet.backend.services.data.dto.MessageInfo;
import com.actdet.backend.services.data.dto.MessagesDTO;
import com.actdet.backend.services.data.dto.MessageKeysInfo;
import com.actdet.backend.services.data.repositories.MessageReceiversRepository;
import com.actdet.backend.services.data.repositories.MessagesRepository;
import com.actdet.backend.services.data.repositories.entities.MessageReceivers;
import com.actdet.backend.services.data.repositories.entities.Messages;
import com.actdet.backend.services.data.repositories.entities.Users;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessagesService {

    private final MessagesRepository messagesRepository;
    private final MessageReceiversRepository messageReceiversRepository;
    private final UserService userService;



    @Autowired
    public MessagesService(MessagesRepository messagesRepository, UserService userService, MessageReceiversRepository messageReceiversRepository) {
        this.messagesRepository = messagesRepository;
        this.messageReceiversRepository = messageReceiversRepository;
        this.userService = userService;
    }

    public List<MessagesDTO> getMessagesByReceiverEmail(String email) {
        List<MessageInfo> messageInfos = messagesRepository.findAllMessagesByReceiverEmail(email);
        return MessagesDTO.mapMessageKeyPairsToMessageDTOs(messageInfos);
    }

    public List<MessagesDTO> getMessagesBySenderEmail(String email) {
        //noinspection SimplifyStreamApiCallChains
        return MessagesDTO.mapMessageKeyPairsToMessageDTOs(messagesRepository.findAllMessagesBySenderEmail(email)).stream()
                .map(msg -> {
                    msg.setRead(true);
                    return msg;
                }).toList();
    }

    @Transactional
    public void markMessageAsReadForUser(String email, Long messageId){
        MessageReceivers messageReceivers = this.messageReceiversRepository.findMessageReceiversByMessage_MessageIdAndReceiver_Email(messageId, email)
                .orElseThrow(() -> new IllegalArgumentException("Specified message does not exist for this user"));
        messageReceivers.setRead(true);
        this.messageReceiversRepository.save(messageReceivers);
    }


    @Transactional
    public void sendMessage(String senderEmail, byte[] encodedMessage,
                            byte[] iv, List<MessageKeysInfo> messageKeysInfos) {
        Users sender = userService.getUserInfoByEmail(senderEmail)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        Messages message = Messages.builder()
                .sender(sender)
                .encryptedMessage(encodedMessage)
                .iv(iv)
                .build();

        List<MessageReceivers> messageReceivers = new ArrayList<>(messageKeysInfos.stream().map(messageKeysInfo -> {
            Users user = userService.getUserInfoByEmail(messageKeysInfo.email())
                    .orElseThrow(() -> new IllegalArgumentException("User does not exist"));
            return new MessageReceivers(message, user, messageKeysInfo.isSender(), messageKeysInfo.isReceiver(), messageKeysInfo.key());
        }).toList());
        message.setReceivers(messageReceivers);
        messagesRepository.save(message);
    }

    @Transactional
    public void deleteMessages(String subjectsEmail, List<Long> messageIds) {
        List<MessageReceivers> receivers = messageReceiversRepository.findAllByMessage_MessageIdInAndReceiver_Email(messageIds, subjectsEmail);
        messageReceiversRepository.deleteAll(receivers);
    }

}


