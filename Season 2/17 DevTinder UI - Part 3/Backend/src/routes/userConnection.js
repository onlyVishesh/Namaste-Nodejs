const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const userRouter = express.Router();

//* To view all the connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }
    const page =
      parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
    let limit =
      parseInt(req.query.limit) > 50
        ? 50
        : parseInt(req.query.limit) < 1
        ? 1
        : parseInt(req.query.limit) || 10;

    //* finding all the connections
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ message: connections });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//* To create user feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //* to get a set of all the user whom user have send/received request including himself
    const hiddenUserProfiles = new Set();

    //* Hiding logged user
    hiddenUserProfiles.add(loggedInUser._id.toString());

    //* Hiding user requests
    connectionRequests.forEach((request) => {
      hiddenUserProfiles.add(request.fromUserId.toString());
      hiddenUserProfiles.add(request.toUserId.toString());
    });

    //* finding limited the user profile that are not in hideUserProfile
    const page =
      parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
    let limit =
      parseInt(req.query.limit) > 50
        ? 50
        : parseInt(req.query.limit) < 1
        ? 1
        : parseInt(req.query.limit) || 10;

    //* finding profile that are not in hiddenUserProfiles and are active
    const userProfiles = await User.find({
      _id: { $nin: Array.from(hiddenUserProfiles) },
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
      //* adding paging
      .skip((page - 1) * limit)
      .limit(limit);

    res
      .status(200)
      .json({ success: true, message: "feed send", users: userProfiles });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

//* To delete a connection
userRouter.delete(
  "/user/connection/:connectionId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }
      const { connectionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(connectionId)) {
        return res.status(400).json({ error: "Invalid connection ID" });
      }

      const connectionExist = await ConnectionRequest.findOneAndDelete({
        _id: connectionId,
        status: "accepted",
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      });

      if (connectionExist) {
        res.status(200).json({ message: "connection deleted" });
      } else {
        throw new Error("connection does not exist");
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = userRouter;
