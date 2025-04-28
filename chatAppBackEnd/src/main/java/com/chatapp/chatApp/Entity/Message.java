package com.chatapp.chatApp.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "message")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Message {

    @Id
    private ObjectId id;
    private ObjectId senderId;
    private String senderName;
    private String senderImg;
    private String message;
    private LocalDateTime time;

    public Message(ObjectId senderId,String message){
        this.senderId=senderId;
        this.message=message;
        this.time= LocalDateTime.now();
    }

}
