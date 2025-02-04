import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer( {port : 8080})

interface User {
    socket: WebSocket;
    room : string;
}

let allSockets: User[] = [];

wss.on("connection",(socket)=>{
   //Whenever a socket connects that socket will send you a message if the message is of type "join" then you push that socket into the global array
    socket.on("message", (message)=>{
        // @ts-ignore
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.type=="join"){
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }
        
        //if the message is of type "chat" then you check the room no this user from the global array
        if(parsedMessage.type=="chat"){
            //const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room
            let currentUserRoom = null;
            for(let i=0;i<allSockets.length;i++){
                if(allSockets[i].socket == socket){
                    currentUserRoom = allSockets[i].room;
                }
            }
         
         // for every one in the room with this room no you send them this message   
            for(let i=0;i<allSockets.length;i++){
                if(allSockets[i].room == currentUserRoom){
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
    })
})