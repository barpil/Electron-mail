package com.actdet.backend.services.data.repositories;

import com.actdet.backend.services.data.repositories.entities.MessageReceivers;
import com.actdet.backend.services.data.repositories.entities.ids.MessageReceiversId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageReceiversRepository extends JpaRepository<MessageReceivers, MessageReceiversId> {
    List<MessageReceivers> findAllByMessage_MessageIdInAndReceiver_Email(List<Long> messageMessageId, String receiverEmail);

    Optional<MessageReceivers> findMessageReceiversByMessage_MessageIdAndReceiver_Email(Long messageMessageId, String receiverEmail);
}
