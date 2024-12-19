const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const { userRole } = require("../middlewares/role");
const requestRouter = express.Router();

//* To send interested or ignored request to user profile
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

      //* Checking if toUserId exist in user database
      if (mongoose.Types.ObjectId.isValid(toUserId)) {
        const isToUserExist = await User.findById(toUserId);
        if (!isToUserExist) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
      } else {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      //* checking if toUserId === fromUserId
      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ error: "You Could not send request to yourself" });
      }

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: `invalid status type ${status}` });
      }

      //* checking if there is existing connectionRequest
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

      //* if user connection does not exist create a new connection
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

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

//* To view all the request send
requestRouter.get("/request/send", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
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
    //* finding all the connection with interested status send form logged in user
    const requestSent = await ConnectionRequest.find({
      fromUserId: user._id,
      status: "interested",
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

    res.status(200).json({ message: requestSent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//* To view all the request received
requestRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
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

    //* finding all the connection with interested status send to logged in user
    const requestSent = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
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

    res.status(200).json({ message: requestSent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//* To view all the ignored profiles
requestRouter.get("/request/ignored", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
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
    //* finding all the connection with ignored status send form logged in user
    const requestSent = await ConnectionRequest.find({
      fromUserId: user._id,
      status: "ignored",
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

    res.status(200).json({ message: requestSent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//* To delete a ignored profiles
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

      //* checking if there is connectionRequest with status interested
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

      //* deleting ignored connection
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

//* To accepted or rejected request send to logged in user
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

      //* checking if requestId is valid
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: `invalid status type ${status}` });
      }

      //* checking if there is connectionRequest with status interested
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

      //* updating new status
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

//* To delete interested request
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

      //* checking if requestId is valid
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }

      //* checking if there is connectionRequest with status interested
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

      //* deleting interested request
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

requestRouter.get(
  "/moderator/requests/totalRequests/:status",
  userAuth,
  userRole("admin", "moderator"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { status } = req.params;
      //* Ensure `status` is valid
      if (
        !["all", "interested", "ignored", "accepted", "rejected"].includes(
          status
        )
      ) {
        return res.status(400).json({ error: "Invalid status." });
      }
      //* finding all the connection with interested status
      let totalRequest;
      if (status === "all")
        totalRequest = await ConnectionRequest.countDocuments();
      else totalRequest = await ConnectionRequest.countDocuments({ status });

      res.status(200).json({ message: "Data retrieved", totalRequest });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

//* to get the request of overall user according to status
requestRouter.get(
  "/admin/requests/:status",
  userAuth,
  userRole("admin"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { status } = req.params;
      //* Ensure `status` is valid
      if (
        !["all", "interested", "ignored", "accepted", "rejected"].includes(
          status
        )
      ) {
        return res.status(400).json({ error: "Invalid status." });
      }

      const page =
        parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
      let limit =
        parseInt(req.query.limit) > 50
          ? 50
          : parseInt(req.query.limit) < 1
          ? 1
          : parseInt(req.query.limit) || 10;
      //* finding all the connection with status
      let requests;
      if (status === "all")
        requests = await ConnectionRequest.find()
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
      else {
        requests = await ConnectionRequest.find({
          status,
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
      }

      res.status(200).json({ message: "Data retrieved", requests });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

//* to get the request of one user
requestRouter.get(
  "/admin/user/requests/:userId",
  userAuth,
  userRole("admin"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }
      const { userId } = req.params;
      //* Checking if userId exist in user database
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
      } else {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const page =
        parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
      let limit =
        parseInt(req.query.limit) > 50
          ? 50
          : parseInt(req.query.limit) < 1
          ? 1
          : parseInt(req.query.limit) || 10;

      //* finding all the connection with status
      const userRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: userId }, { toUserId: userId }],
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

      res.status(200).json({ message: "Data retrieved", userRequests });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = requestRouter;
