package com.actdet.backend.services.data.repositories;

import com.actdet.backend.services.data.repositories.entities.Messages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessagesRepository extends JpaRepository<Messages, Long> {

    List<Messages> getMessagesByReceiver_EmailAndIsDeletedByReceiverFalse(String receiverEmail);

    List<Messages> getMessagesBySender_EmailAndIsDeletedBySenderFalse(String email);
}
