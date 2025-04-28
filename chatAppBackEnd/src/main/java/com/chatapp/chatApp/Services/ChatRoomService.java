package com.chatapp.chatApp.Services;

import com.chatapp.chatApp.Entity.ChatRoom;
import com.chatapp.chatApp.Entity.Message;
import com.chatapp.chatApp.Entity.User;
import com.chatapp.chatApp.Repository.ChatRoomRepo;
import com.chatapp.chatApp.Repository.MessageRepo;
import com.chatapp.chatApp.Repository.UserRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ChatRoomService {
    @Autowired
    ChatRoomRepo chatRoomRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    MessageRepo messageRepo;
    public ResponseEntity<?> createChatRoom(ChatRoom chatRoom, User user){

        if (chatRoomRepo.findById(chatRoom.getRoomKey()).isPresent()) {
            return new ResponseEntity<>("Room Already Exist with key" + chatRoom.getRoomKey(), HttpStatus.BAD_REQUEST);
        }
        if(chatRoom.getRoomKey()==null) return new ResponseEntity<>("Id can not be null",HttpStatus.BAD_REQUEST);
        chatRoom.getAdmin().add(user.getId());
        chatRoom.getMember().add(user.getId());
        ChatRoom savedRoom=chatRoomRepo.save(chatRoom);
        user.getGroup().add(savedRoom);
        userRepo.save(user);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @Transactional
    public void deleteRoom(String roomKey,User user){
        try {
            Optional<ChatRoom> chatRoom = chatRoomRepo.findById(roomKey);
            if (chatRoom.isPresent()) {
                if (chatRoom.get().getAdmin().contains(user.getId())) {
                    user.getGroup().remove(chatRoom.get());

                    for (int i = 0; i < chatRoom.get().getChat().size(); i++) {
                        messageRepo.delete(chatRoom.get().getChat().get(i));
                    }
                    userRepo.save(user);
                    chatRoomRepo.deleteById(chatRoom.get().getRoomKey());
                }
            }
        }
        catch (Exception e){
            throw new RuntimeException("Unexpected error" + e);
        }

    }

    public ResponseEntity<?> update(User user, ChatRoom chatRoom) {
        Optional<ChatRoom> roomInDb = chatRoomRepo.findById(chatRoom.getRoomKey());

        if (roomInDb.isPresent()) {
            ChatRoom existingRoom = roomInDb.get();

            if (existingRoom.getAdmin().contains(user.getId())) {
                if (chatRoom.getRoomName() != null && !chatRoom.getRoomName().isEmpty())
                    existingRoom.setRoomName(chatRoom.getRoomName());

                if (chatRoom.getDescription() != null && !chatRoom.getDescription().isEmpty())
                    existingRoom.setDescription(chatRoom.getDescription());

                chatRoomRepo.save(existingRoom);
                user = userRepo.findById(user.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }

        return new ResponseEntity<>("You are not Allowed to change group details", HttpStatus.BAD_REQUEST);
    }

    public void sendMessage(String roomId, Message message){
        Optional<ChatRoom> room=chatRoomRepo.findById(roomId);
        if(room.isEmpty()) {
            throw new RuntimeException("room id not found");
        }
        messageRepo.save(message);
        room.get().getChat().add(message);
        chatRoomRepo.save(room.get());
    }

    public ResponseEntity<?>  JoinRoom(String userName,String roomKey){
        User user=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if(room.isEmpty()) return new ResponseEntity<>("Room not present",HttpStatus.BAD_REQUEST);
        if(user.getGroup().contains(room.get())) return new ResponseEntity<>("You are already in Group",HttpStatus.BAD_REQUEST);
        user.getGroup().add(room.get());

        room.get().getMember().add(user.getId());

        userRepo.save(user);
        chatRoomRepo.save(room.get());
        return new ResponseEntity<>(user,HttpStatus.OK);
    }
    public void leaveGroup(String userName,String roomKey){
        User user=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if (room.isPresent()) {
            user.getGroup().remove(room.get());
            room.get().getMember().remove(user.getId());
            room.get().getAdmin().remove(user.getId());
            if(room.get().getAdmin().isEmpty()){
                if(room.get().getMember().isEmpty())
                    chatRoomRepo.delete(room.get());
                else
                    room.get().getAdmin().add(room.get().getMember().getFirst());
            }
            userRepo.save(user);
            chatRoomRepo.save(room.get());
        }
    }
    public void makeAdmin(String userName, ObjectId userId, String roomKey){
        User admin=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if(room.isPresent() && room.get().getAdmin().contains(admin.getId())){
            room.get().getAdmin().add(userId);
            chatRoomRepo.save(room.get());
        }
    }
    public void removeAdmin(String userName,ObjectId userId,String roomKey){
        User admin=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if(room.isPresent() && room.get().getAdmin().contains(admin.getId())){
            room.get().getAdmin().remove(userId);
            chatRoomRepo.save(room.get());
        }
    }
}
