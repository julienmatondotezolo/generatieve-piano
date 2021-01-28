"use strict";

let roomIdUuid = uuidv4();
//let socket = io();
//const socket = io.connect("http://127.0.0.1:5500");

document.getElementById("testButton").addEventListener("click", () => {
  const socket = io.connect(`http://127.0.0.1:5500/`, {
    transports: ["websocket"],
  });
  console.log(io());
  console.log("connected");
  socket.emit("join-room", roomIdUuid, 10);
  socket.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
      console.log(roomId, userId);
      //socket.join(roomId);
    });
  });

  console.log(socket);
});
