import { WebSocketServer } from "ws";
import WebSocket from "ws";

const wss = new WebSocketServer({ port: 8081 });

interface User {
   socket: WebSocket,
   room: string;
}

let allSockets: User[] = [];


wss.on("connection", (socket) => {

   socket.on("message", (message) => {
      
      const parsedMessage = JSON.parse(message as unknown as string);

      if (parsedMessage.type === "join") {
         console.log("user joined room " + parsedMessage.payload.roomId);
         allSockets.push({
            socket,
            room: parsedMessage.payload.roomId
         })
      }

      if (parsedMessage.type === "chat") {
         // const currentUserRoom = allSockets.find((x)=>x.socket == socket).room;
         let currentUserRoom = null;
         for (let i = 0; i < allSockets.length; i++) {
            if (allSockets[i].socket === socket) {
               currentUserRoom = allSockets[i].room
            }
         }

         for (let i = 0; i < allSockets.length; i++) {
            if (allSockets[i].room === currentUserRoom) {
               allSockets[i].socket.send(parsedMessage.payload.message)
            }
         }
      }

   })

})