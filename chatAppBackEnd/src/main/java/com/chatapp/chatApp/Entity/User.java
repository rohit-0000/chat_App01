package com.chatapp.chatApp.Entity;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder //just like constructor
@Document(collection = "user")
public class User {
    @Id
    private ObjectId id;

    @Indexed(unique = true)
    @NonNull
    private String email;
    @Indexed(unique = true)
    @NonNull
    private  String userName;
    @NonNull
    private  String name;
    @NonNull
    private String password;

    private Map<String,String> aiQna=new HashMap<>();

    private String about="";

    List<String> roles=new ArrayList<>();

    private String userImageUrl;
    private String public_id;

    @DBRef
    private List<ChatRoom> group=new ArrayList<>();


}
