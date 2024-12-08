const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const fromUserId = user._id;
      const { status, toUserId } = req.params;

      //! Checking if toUserId exist in user database

      if (mongoose.Types.ObjectId.isValid(toUserId)) {
        const isToUserExist = await User.findById(toUserId);
        if (!isToUserExist) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
      } else {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      //! check if toUserId === fromUserId
      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ error: "You Could not send request to yourself" });
      }

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: `invalid status type ${status}` });
      }

      //! checking if there is existing connectionRequest

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ error: "Connection request already exist" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      if (status === "interested") {
        res.status(200).json({ message: "Connection request Send" });
      } else if (status === "ignored") {
        res.status(200).json({ message: "User ignored" });
      } else {
        res.status(400).json({ error: "Invalid request type" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

requestRouter.get("/request/send", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    const requestSent = await ConnectionRequest.find({ fromUserId: user._id });
    console.log(requestSent);

    res.status(200).json({ message: requestSent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

requestRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    const requestSent = await ConnectionRequest.find({ toUserId: user._id });
    console.log(requestSent);

    res.status(200).json({ message: requestSent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = requestRouter;
