const express = require("express");
const chatRoute = express.Router();
const { userAuth } = require("../middlewares/auth");

const User = require("../models/user");
const Chat = require("../models/chat");

chatRoute.get("/chat/userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUsername = req.user.username;
    if (!loggedInUsername || !userId) {
      return res.status(200).json({
        success: false,
        error: "user not found",
      });
    }
    let chat = Chat.findOne({
      participants: { $all: [loggedInUsername, userId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [loggedInUsername, userId],
      });

      await chat.save();
    }

    return res.status(200).json({
      success: true,
      message: "user is not Premium",
      chat,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = chatRoute;
