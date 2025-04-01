const socket = require("socket.io");
const { getSecretRoomId } = require("./constants");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: process.env.FrontendURL, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ loggedInUsername, userId }) => {
      const roomId = getSecretRoomId(loggedInUsername, userId);
      console.log("room joined", roomId);
      console.log(loggedInUsername + " joined");

      socket.join(roomId);
    });

    socket.on("sendMessage", ({ loggedInUsername, userId, newMessage }) => {
      const roomId = getSecretRoomId(loggedInUsername, userId);

      console.log(userId + " Received " + newMessage.text);
      io.to(roomId).emit("messageReceived", { newMessage });
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
