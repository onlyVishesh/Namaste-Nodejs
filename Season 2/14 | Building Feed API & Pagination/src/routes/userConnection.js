const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const userRouter = express.Router();

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
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

    res.status(200).json({ message: connections });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    //! to get a set of all the user whom user have send/received request including himself
    const hideUserProfile = new Set();

    //! Hiding logged user
    hideUserProfile.add(user._id.toString());

    //! Hiding user requests
    connectionRequests.forEach((request) => {
      hideUserProfile.add(request.fromUserId.toString());
      hideUserProfile.add(request.toUserId.toString());
    });

    const userProfiles = await User.find({
      _id: { $nin: Array.from(hideUserProfile) },
      status: "active",
    })
      .select([
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])

    res.status(200).json({ message: userProfiles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


module.exports = userRouter;
