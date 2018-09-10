const express = require('express');
const http = require('http');
const socketServer = require('socket.io');
const port = 4000;

//////////////////////////// App and socket server setup ////////////////////////////
const app = express();
const server = http.createServer(app);
const io = socketServer(server);

server.listen(port, () => {
    console.log(`Live chat express server with socket is running on port: ${port}!`)
})

///////////////////////////////////// Socket logics ////////////////////////////////
let chatRoom = new Map();
chatRoom.set("Lobby", []);
let userId = 1;

// let currentRoom = "Lobby";

io.on('connection', socket => {
    /** User login */
    socket.on('login', () => {
        console.log(`A user connected...`);
        let userName = `Guest ${userId++}`;

        chatRoom.get("Lobby").push(userName);
        let rooms = [...chatRoom.keys()];

        // emit current user about room info and its assigned name
        socket.emit('userAdded', {
            room: "Lobby",
            rooms: rooms,
            user: userName, 
        });

        // make current user join the room Lobby
        socket.join("Lobby");

        // emit current user about users in the room
        socket.emit("loginMsg", {
            msg: `You are known as ${userName}`,
            users: `Users currently in Lobby: ${chatRoom.get("Lobby")}`,
            // room: "Lobby",
            rooms: rooms,
            // user: userName
        });

        // broadcast emit other users about new user joined and update current users in the room
        socket.broadcast
        .to("Lobby")
        .emit("loginMsg", {
            msg: `${userName} has joined this room.`,
            users: `Users currently in Lobby: ${chatRoom.get("Lobby")}`,
            rooms: rooms
        });

    })

    /** Send chat message */
    socket.on("sendChat", (input) => {
        // console.log(`input.room in sendChat server: ${input.room}`)
        // display new message to current user
        socket.emit("chatSent", {
            msg: `You said: ${input.msg}`
        });
        // broadcase new message
        socket.broadcast.to(input.room).emit("chatSent", {
            msg: `${input.user} said: ${input.msg}`
        });
    })


    /** Change user name */    
  
    socket.on("changeName", (input) => {
        // Change name
        let users = chatRoom.get(input.room);
        let index = users.indexOf(input.oldName);
        users.splice(index, 1, input.newName);

        // Update username in chatroom action/reducer
        socket.emit('nameUpdated', {
            user: input.newName, 
        });

        // display new message to current user
        socket.emit("nameChanged", {
            msg: `You are now known as ${input.newName} `,
            // user: input.newName,
            users: `Users currently in ${input.room}: ${chatRoom.get(input.room)}`
        });
        // broadcase updated users in current room
        socket.broadcast.to(input.room).emit("nameChanged", {
            users: `Users currently in ${input.room}: ${chatRoom.get(input.room)}`
        });
    })

    /** Change room name */
    socket.on("changeRoom", (input) => {
        console.log('changing room....')
        // if new room doesn't exist in state
        let prevRooms = [...chatRoom.keys()];
        if(!chatRoom.has(input.newRoom)) {
            chatRoom.set(input.newRoom, []);
        }
        // delete current user from old room
        let prevUsers = chatRoom.get(input.oldRoom);
        prevUsers.splice(prevUsers.indexOf(input.user), 1);
        chatRoom.set(input.oldRoom, prevUsers);
        let rooms = [...chatRoom.keys()];

        // add current user into new room
        // chatRoom.set(input.newRoom, [...chatRoom.get(input.newRoom), input.user]);
        chatRoom.get(input.newRoom).push(input.user);

        socket.leave(input.oldRoom);
        socket.join(input.newRoom);
        

        // Update roomname in chatroom action/reducer
        socket.emit('roomUpdated', {
            room: input.newRoom, 
            rooms: rooms
        });

        // display new message to current user
        socket.emit("roomChanged", {
            msg: `Room changed. `,
            users: `Users currently in ${input.newRoom}: ${chatRoom.get(input.newRoom)}`,
            rooms: rooms
        });
        // broadcase updated users in old room
        socket.broadcast.to(input.oldRoom).emit("roomChanged", {
            msg: `${input.user} left ${input.oldRoom}`,
            users: `Users currently in ${input.oldRoom}: ${chatRoom.get(input.oldRoom)}`,
            rooms: rooms
        });

        // broadcase updated users in new room
        socket.broadcast.to(input.newRoom).emit("roomChanged", {
            msg: `${input.user} joined ${input.newRoom}`,
            users: `Users currently in ${input.newRoom}: ${chatRoom.get(input.newRoom)}`,
            rooms: rooms
        });


        // broadcast others that a new room is added
        prevRooms.forEach((r) => {
            socket.broadcast.to(r).emit("roomChanged", {
                users: `Users currently in ${r}: ${chatRoom.get(r)}`,
                rooms: rooms
            });
        })

    })

    socket.on('disconnect', function(){
        console.log(`A user left the room`);
    });

    
})


