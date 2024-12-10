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

    const requestSent = await ConnectionRequest.find({
      fromUserId: user._id,
      status: "interested",
    }).populate("fromUserId toUserId", [
      "firstName",
      "lastName",
      "username",
      "avatar",
      "about",
      "skills",
      "gender",
      "status",
    ]);

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

    const requestSent = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId toUserId", [
      "firstName",
      "lastName",
      "username",
      "avatar",
      "about",
      "skills",
      "gender",
      "status",
    ]);

    res.status(200).json({ message: requestSent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

requestRouter.get("/request/ignored", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    const requestSent = await ConnectionRequest.find({
      fromUserId: user._id,
      status: "ignored",
    }).populate("fromUserId toUserId", [
      "firstName",
      "lastName",
      "username",
      "avatar",
      "about",
      "skills",
      "gender",
      "status",
    ]);

    res.status(200).json({ message: requestSent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

requestRouter.delete(
  "/request/review/ignored/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }

      //! checking if there is connectionRequest with status interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        fromUserId: user._id,
        status: "ignored",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ error: "Connection request does not exist" });
      }

      const { deletedCount } = await connectionRequest.deleteOne({
        _id: requestId,
      });

      if (deletedCount >= 1) {
        res.status(200).json({ message: "User has been unignored" });
      } else {
        res
          .status(400)
          .json({ error: "Connection request could not retrieved" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { status, requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: `invalid status type ${status}` });
      }

      //! checking if there is connectionRequest with status interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ error: "Connection request does not exist" });
      }

      connectionRequest.status = status;

      await connectionRequest.save();

      if (status === "accepted") {
        res.status(200).json({ message: "Connection request accepted" });
      } else if (status === "rejected") {
        res.status(200).json({ message: "Connection request rejected" });
      } else {
        res.status(400).json({ error: "Invalid request type" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

requestRouter.delete(
  "/request/review/retrieved/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }

      //! checking if there is connectionRequest with status interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        fromUserId: user._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ error: "Connection request does not exist" });
      }

      const { deletedCount } = await connectionRequest.deleteOne({
        _id: requestId,
      });

      if (deletedCount >= 1) {
        res
          .status(200)
          .json({ message: "Connection request has been retrieved" });
      } else {
        res
          .status(400)
          .json({ error: "Connection request could not retrieved" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = requestRouter;
