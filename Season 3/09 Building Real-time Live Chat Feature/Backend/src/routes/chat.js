// chatRoute.js

const express = require("express");
const chatRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");
const moment = require("moment");
const { encrypt, decrypt } = require("../utils/encryption");

const onlineUsers = new Set(); // This will be updated by socket logic

function humanizeTime(date) {
  if (!date) return "";
  return moment(date).fromNow();
}

// Get all chats of logged in user with last message and participant details
chatRoute.get("/chats", userAuth, async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ username: req.user.username });
    if (!loggedInUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Find all chats where loggedInUser is a participant
    const chats = await Chat.find({ participants: loggedInUser._id })
      .populate("participants", "username avatar firstName lastName")
      .populate("lastMessage.sender", "username")
      .sort({ updatedAt: -1 });

    // Format response to send participant info except loggedInUser
    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== loggedInUser._id.toString()
      );
      const fullName =
        (otherParticipant.firstName || "") +
        (otherParticipant.lastName ? " " + otherParticipant.lastName : "");
      return {
        userId: otherParticipant.username,
        name: fullName.trim() || otherParticipant.username,
        avatar:
          otherParticipant.avatar ||
          `https://ui-avatars.com/api/?name=${otherParticipant.username}`,
        lastMessage: chat.lastMessage?.content
          ? decrypt(chat.lastMessage.content)
          : "",
        time: humanizeTime(
          chat.lastMessage ? chat.lastMessage.createdAt : chat.updatedAt
        ),
        unread: chat.getUnreadCountForUser(loggedInUser._id),
      };
    });

    return res.json({ success: true, chats: formattedChats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get messages between logged in user and another user
chatRoute.get("/chats/:userId/messages", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, before } = req.query;
    const loggedInUser = await User.findOne({ username: req.user.username });
    const otherUser = await User.findOne({ username: userId });
    if (!loggedInUser || !otherUser) {
      // Still return header info if possible
      return res.status(404).json({
        success: false,
        error: "User not found",
        header: {
          userId,
          name: userId,
          avatar: `https://ui-avatars.com/api/?name=${userId}`,
          online: onlineUsers.has(userId),
        },
      });
    }
    // Block chat if either user has blocked the other
    if (
      loggedInUser.blockedUsers.includes(otherUser._id) ||
      otherUser.blockedUsers.includes(loggedInUser._id)
    ) {
      return res.status(403).json({
        success: false,
        error: "You are blocked or have blocked this user.",
        header: {
          userId: otherUser.username,
          name:
            (otherUser.firstName || "") +
            (otherUser.lastName ? " " + otherUser.lastName : ""),
          avatar:
            otherUser.avatar ||
            `https://ui-avatars.com/api/?name=${otherUser.username}`,
          online: onlineUsers.has(otherUser.username),
        },
      });
    }
    // Check if users are connected
    const connection = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: loggedInUser._id,
          toUserId: otherUser._id,
          status: "accepted",
        },
        {
          fromUserId: otherUser._id,
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    });
    if (!connection) {
      return res.status(403).json({
        success: false,
        error: "You are not connected with this user. Chat is blocked.",
        header: {
          userId: otherUser.username,
          name:
            (otherUser.firstName || "") +
            (otherUser.lastName ? " " + otherUser.lastName : ""),
          avatar:
            otherUser.avatar ||
            `https://ui-avatars.com/api/?name=${otherUser.username}`,
          online: onlineUsers.has(otherUser.username),
        },
      });
    }
    const chat = await Chat.findOne({
      participants: { $all: [loggedInUser._id, otherUser._id] },
    }).populate("messages.sender", "username");
    if (!chat) {
      return res.json({
        success: true,
        messages: [],
        header: {
          userId: otherUser.username,
          name:
            (otherUser.firstName || "") +
            (otherUser.lastName ? " " + otherUser.lastName : ""),
          avatar:
            otherUser.avatar ||
            `https://ui-avatars.com/api/?name=${otherUser.username}`,
          online: onlineUsers.has(otherUser.username),
        },
      });
    }
    // Pagination logic
    let msgs = chat.messages;
    if (before) {
      msgs = msgs.filter((msg) => msg.createdAt < new Date(before));
    }
    msgs = msgs.slice(-limit); // get the last N messages before 'before'
    // Format messages to your UI structure
    const formattedMessages = msgs.map((msg) => ({
      userId: msg.sender.username,
      sender: msg.sender.username,
      text: decrypt(msg.content),
      time: humanizeTime(msg.createdAt),
      createdAt: msg.createdAt,
      _id: msg._id,
    }));
    return res.json({
      success: true,
      messages: formattedMessages,
      header: {
        userId: otherUser.username,
        name:
          (otherUser.firstName || "") +
          (otherUser.lastName ? " " + otherUser.lastName : ""),
        avatar:
          otherUser.avatar ||
          `https://ui-avatars.com/api/?name=${otherUser.username}`,
        online: onlineUsers.has(otherUser.username),
      },
      hasMore: msgs.length === Number(limit),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = chatRoute;
