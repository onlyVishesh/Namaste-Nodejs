const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
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
        { formUserId: user._id, status: "accepted" },
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

module.exports = userRouter;
