package com.chatapp.chatApp.Entity;


import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "chatroom")
public class ChatRoom {

    @Id
//    private ObjectId id;
//    @Indexed(unique = true)
    private String roomKey;

    @NonNull
    private String roomName;

    private String description;
    private String groupImageUrl;
    private String public_id;

    private List<ObjectId> admin = new ArrayList<>();
    private List<ObjectId> member = new ArrayList<>();

    @DBRef
    private List<Message> chat = new ArrayList<>();
}
