import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
let client = null;
export const connectToAllRooms = (roomIds, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/chat");
  
  client = Stomp.over(() => socket);
  
  client.connect({}, () => {
    console.log("web socket connected ");
    roomIds.forEach((roomId) => {
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        onMessageReceived(roomId, JSON.parse(message.body));
        console.log(message);
      });
    });
  });
  
  client.onStompError = (frame) => {
    console.error("STOMP error", frame.headers["message"]);
  };
  client.onWebSocketError = (error) => {
    console.error("WebSocket error", error);
  };

  return client;
};

export const sendMessage = (roomId, messageObj) => {
  if (client && client.connected) {
    client.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(messageObj));
    toast.success("mesaage sent");
  } else {
    console.error("WebSocket not connected");
  }
};
