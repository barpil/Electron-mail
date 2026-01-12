package com.actdet.backend.services.data.repositories;

import com.actdet.backend.services.data.dto.MessageInfo;
import com.actdet.backend.services.data.repositories.entities.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MessagesRepository extends JpaRepository<Messages, Long> {

    @Query(
            "SELECT m as message, mr.encryptedEncryptionKey as key, mr.read as read FROM Messages m JOIN MessageReceivers mr ON mr.message = m WHERE mr.receiver.email = :email AND mr.isReceiver = true "
    )
    List<MessageInfo> findAllMessagesByReceiverEmail(@Param("email") String email);

    @Query(
            "SELECT m as message, mr.encryptedEncryptionKey as key, mr.read as read FROM Messages m JOIN MessageReceivers mr ON mr.message = m WHERE mr.receiver.email = :email AND mr.isSender = true"
    )
    List<MessageInfo> findAllMessagesBySenderEmail(@Param("email") String email);


}
