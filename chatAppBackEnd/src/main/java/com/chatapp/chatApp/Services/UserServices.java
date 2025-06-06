package com.chatapp.chatApp.Services;


import com.chatapp.chatApp.Entity.ChatRoom;
import com.chatapp.chatApp.Entity.User;
import com.chatapp.chatApp.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class UserServices {
   @Autowired
   public UserRepo userRepo;
   @Autowired
   private ChatRoomService chatRoomService;
   private static final PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
   public User findByUsername(String userName){
       return userRepo.findByUserName(userName);
   }
   public User findByEmail(String email){
       return userRepo.findByEmail(email);
   }
   public void createNewUser(User user){
       user.setPassword(passwordEncoder.encode(user.getPassword()));
       user.setRoles(Arrays.asList("USER"));
       userRepo.save(user);
   }

   public ResponseEntity<?> updateUser(User newUser,User oldUser){
       if(newUser.getUserName()!=null && !newUser.getUserName().isEmpty() && !newUser.getUserName().equals(oldUser.getUserName())){
           User updatedUser=userRepo.findByUserName(newUser.getUserName());
           if(updatedUser!=null) return new ResponseEntity<>("user already exist with this userName", HttpStatus.BAD_REQUEST);
           oldUser.setUserName(newUser.getUserName());
       }
       if(newUser.getUserName()!=null&&!newUser.getPassword().isEmpty()){
           oldUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
       }
       if(newUser.getName()!=null && !newUser.getName().isEmpty() && !newUser.getName().equals(oldUser.getName())) {
            oldUser.setName(newUser.getName());
       }
       if(newUser.getEmail()!=null && !newUser.getEmail().isEmpty() && !newUser.getEmail().equals(oldUser.getEmail())){
            User updatedUser=userRepo.findByEmail(newUser.getEmail());
            if(updatedUser!=null)  return new ResponseEntity<>("user already exist with this email", HttpStatus.BAD_REQUEST);
            oldUser.setEmail(newUser.getEmail());
       }
       if(newUser.getAbout()!=null && !newUser.getAbout().isEmpty() && !newUser.getAbout().equals(oldUser.getAbout())){
           oldUser.setAbout(newUser.getAbout());
       }
       userRepo.save(oldUser);
       return new ResponseEntity<>(oldUser,HttpStatus.CREATED);
   }

   public void deleteUser(User user){
       userRepo.delete(user);
   }

   public void leaveChatRoom(User user,String roomKey){
       Optional<ChatRoom> chatRoom=chatRoomService.chatRoomRepo.findById(roomKey);
       if(chatRoom.get().getAdmin().contains(user)){

           chatRoom.get().getAdmin().remove(user);
           if(chatRoom.get().getAdmin().isEmpty() && chatRoom.get().getMember().size()>0)
            chatRoom.get().getAdmin().add(chatRoom.get().getMember().get(0));
           else chatRoomService.deleteRoom(roomKey,user);
       }
       else{
           chatRoom.get().getMember().remove(user);
           user.getGroup().remove(roomKey);
           chatRoomService.chatRoomRepo.save(chatRoom.get());
           userRepo.save(user);
       }
   }
}
