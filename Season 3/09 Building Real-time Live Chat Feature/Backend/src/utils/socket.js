const socket = require("socket.io");
const { getSecretRoomId } = require("./constants");
const Chat = require("../models/chat");
const User = require("../models/user");

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

    socket.on(
      "sendMessage",
      async ({ loggedInUsername, userId, newMessage }) => {
        try {
          const senderUser = await User.findOne({ username: loggedInUsername });
          const receiverUser = await User.findOne({ username: userId });

          const chat =
            (await Chat.findOne({
              participants: { $all: [senderUser._id, receiverUser._id] },
            })) ||
            (await Chat.create({
              participants: [senderUser._id, receiverUser._id],
              messages: [],
            }));

          const messageDoc = {
            sender: senderUser._id,
            content: newMessage.text,
            readBy: [senderUser._id],
            createdAt: new Date(),
          };

          chat.messages.push(messageDoc);
          chat.lastMessage = messageDoc;

          await chat.save();

          io.to(getSecretRoomId(loggedInUsername, userId)).emit(
            "messageReceived",
            {
              newMessage: {
                ...newMessage,
                sender: loggedInUsername,
                time: newMessage.time,
              },
            }
          );
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
