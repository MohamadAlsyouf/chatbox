const express = require('express');
const app = express();
// global http import to build our server w socket.io
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// cors middleware
app.use(cors());

const server = http.createServer(app);

// new socket.io Server instance connecting to our server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// listening for connection to socket.io server
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    console.log("data: ", data);
  });


  // when someone types a message (in Chat.js), they emit the send message event and
  // send data here, this will emit the message sent to everyone listening for message (in the room)
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log("AUTHOR: ", data.author);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id)
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING")
});
