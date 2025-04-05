const socket = require("socket.io");
const { getSecretRoomId } = require("./constants");
const Chat = require("../models/chat");
const User = require("../models/user");
const { encrypt } = require("./encryption");

const onlineUsers = new Set();

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: process.env.FrontendURL, credentials: true },
  });

  io.on("connection", (socket) => {
    let currentUsername = null;
    socket.on("joinChat", async ({ loggedInUsername, userId }) => {
      const roomId = getSecretRoomId(loggedInUsername, userId);
      console.log("room joined", roomId);
      console.log(loggedInUsername + " joined");
      socket.join(roomId);
      currentUsername = loggedInUsername;
      // Mark user as online
      onlineUsers.add(loggedInUsername);
      // Emit online status to both rooms
      io.to(getSecretRoomId(loggedInUsername, userId)).emit(
        "userOnlineStatus",
        { username: loggedInUsername, online: true }
      );
      io.to(getSecretRoomId(userId, loggedInUsername)).emit(
        "userOnlineStatus",
        { username: loggedInUsername, online: true }
      );
      // Mark all messages as read for this user
      try {
        const senderUser = await User.findOne({ username: loggedInUsername });
        const receiverUser = await User.findOne({ username: userId });
        if (senderUser && receiverUser) {
          const chat = await Chat.findOne({
            participants: { $all: [senderUser._id, receiverUser._id] },
          });
          if (chat) {
            let updated = false;
            chat.messages.forEach((msg) => {
              if (!msg.readBy.some((id) => id.equals(senderUser._id))) {
                msg.readBy.push(senderUser._id);
                updated = true;
              }
            });
            if (updated) {
              await chat.save();
              // Emit unread update to both users
              io.to(getSecretRoomId(loggedInUsername, userId)).emit(
                "unreadUpdated",
                { userId: loggedInUsername }
              );
              io.to(getSecretRoomId(userId, loggedInUsername)).emit(
                "unreadUpdated",
                { userId: userId }
              );
            }
          }
        }
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
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
            content: encrypt(newMessage.text),
            readBy: [senderUser._id],
            createdAt: new Date(),
          };

          chat.messages.push(messageDoc);
          chat.lastMessage = messageDoc;

          await chat.save();

          // Emit to both sender and receiver rooms
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
          io.to(getSecretRoomId(userId, loggedInUsername)).emit(
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

    // Typing indicator events
    socket.on("typing", ({ loggedInUsername, userId }) => {
      const roomId = getSecretRoomId(loggedInUsername, userId);
      socket.to(roomId).emit("typing", { username: loggedInUsername });
    });
    socket.on("stopTyping", ({ loggedInUsername, userId }) => {
      const roomId = getSecretRoomId(loggedInUsername, userId);
      socket.to(roomId).emit("stopTyping", { username: loggedInUsername });
    });

    socket.on("disconnect", () => {
      if (currentUsername) {
        onlineUsers.delete(currentUsername);
        // Emit offline status to all rooms this user could be in
        io.emit("userOnlineStatus", {
          username: currentUsername,
          online: false,
        });
      }
    });
  });
};

module.exports = initializeSocket;
module.exports.onlineUsers = onlineUsers;
