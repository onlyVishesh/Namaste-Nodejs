const express = require("express");
const profileRouter = express.Router();
const { mongoose } = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileData } = require("../utils/validation");
const ConnectionRequest = require("../models/connectionRequest");
const { userRole } = require("../middlewares/role");

//* To view all the users (admin)
profileRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ error: "0 user exist" });
    }
    res.status(200).json({ message: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//* To view ourself profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.status(200).json({ message: loggedInUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//* To edit fields in profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //* checking if fields are updatable
    if (!validateProfileData(req)) {
      throw new Error("Update not allow");
    }

    const loggedInUser = req.user;

    //* updating values of field given in request
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, Your profile has been updated`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//* To delete profile/account
profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }
    const { password } = req.body;
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //! deleting all the connectionRequests

      const { deletedCount: noOfConnectionDeleted } =
        await ConnectionRequest.deleteMany({
          $or: [{ fromUserId: user._id }, { toUserId: user._id }],
        });
      const { deletedCount } = await User.deleteOne({ _id: user._id });

      if (deletedCount === 1) {
        res.status(200).json({
          message: `Account with username : ${user.username} and email : ${user.email} having total ${noOfConnectionDeleted} connection requests has been deleted`,
        });
      } else {
        throw new Error("Account has not deleted");
      }
    } else {
      throw new Error("Password is incorrect");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//* To change status active/deactivated
profileRouter.patch("/profile/changeStatus", userAuth, async (req, res) => {
  try {
    //* storing logged user data
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    const { status, password } = req.body;

    //* Validating password
    const isPasswordValid = await loggedInUser.validatePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Invalid password. Please try again." });
    }

    //* Handle if `status` is banned
    if (loggedInUser.status === "banned") {
      return res.status(403).json({
        message: `${loggedInUser.firstName}, your account has been banned. Contact admin for more details.`,
      });
    }
    if (status === "banned") {
      return res.status(403).json({
        message: `${loggedInUser.firstName}, you need to be an admin or moderator to ban a loggedInUser.`,
      });
    }

    //* Ensure `status` is valid
    if (!["active", "deactivated"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Use 'active' or 'deactivated'." });
    }

    //* Handle status change logic
    if (loggedInUser.status === status) {
      const message =
        status === "active"
          ? "Your account is already active."
          : "Your account is already deactivated.";
      return res.status(200).json({ message });
    }

    //* Update the loggedInUser's status
    loggedInUser.status = status;
    await loggedInUser.save();
    const message =
      status === "active"
        ? "Your account has been reactivated."
        : "Your account has been deactivated.";
    return res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//* To view Someone profile
profileRouter.get("/profile/:userId", async (req, res) => {
  try {
    //* storing userId from params
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Username must be provided" });
    }

    //* finding if user present in collection
    const user = await User.findOne({ username: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//* Admin routes

//* To change the role of user to admin, moderator or user
profileRouter.patch(
  "/admin/changeRole/:role/:userId",
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

      const { role, userId } = req.params;

      //* Checking if userId exist in user database
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
      } else {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      //* array of roles allowed to update
      const allowedRole = ["admin", "moderator", "user"];

      if (!allowedRole.includes(role)) {
        return res.status(400).json({ error: `invalid Role ${role}` });
      }

      //* finding user
      const user = await User.findById(userId);

      //* checking if user is admin
      const adminEmails = process.env.adminEmails
        ? process.env.adminEmails.split(",")
        : [];
      if (adminEmails.includes(user.email)) {
        return res.status(400).json({
          error: `Role of ${
            user.firstName[0].toUpperCase() + user.firstName.slice(1)
          } could not be update.`,
        });
      }

      //* if role is same as previous role
      if (user.role === role) {
        return res.status(400).json({
          error: `${
            user.firstName[0].toUpperCase() + user.firstName.slice(1)
          } already have ${role} role`,
        });
      }

      //* updating role
      user.role = role;
      await user.save();

      res.status(200).json({
        message: `Role of ${
          user.firstName[0].toUpperCase() + user.firstName.slice(1)
        } is updated to ${role}`,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

//* Moderator routes
profileRouter.patch(
  "/moderator/changeRole/:role/:userId",
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

      const { role, userId } = req.params;

      //* Checking if userId exist in user database
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
      } else {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      //* checking if loggedInUser === userId
      if (loggedInUser._id.equals(userId)) {
        return res.status(400).json({ error: "You could not change your oun" });
      }

      //* array of roles allowed to update
      const allowedRole = ["moderator", "user"];

      if (!allowedRole.includes(role)) {
        return res.status(400).json({ error: `invalid Role ${role}` });
      }

      //* finding user
      const user = await User.findById(userId);

      //* checking if user is admin
      const adminEmails = process.env.adminEmails
        ? process.env.adminEmails.split(",")
        : [];
      if (adminEmails.includes(user.email)) {
        return res.status(400).json({
          error: `Role of ${
            user.firstName[0].toUpperCase() + user.firstName.slice(1)
          } could not be update.`,
        });
      }

      if (user.role === "admin") {
        return res.status(400).json({
          message: `Admin role could not be changed. If you are admin try admin api.`,
        });
      }

      //* checking if new role is same as previous
      if (user.role === role) {
        return res.status(400).json({
          message: `${
            user.firstName[0].toUpperCase() + user.firstName.slice(1)
          } already have ${role} role`,
        });
      }

      //* updating role
      user.role = role;
      await user.save();

      res.status(200).json({
        message: `Role of ${
          user.firstName[0].toUpperCase() + user.firstName.slice(1)
        } is updated to ${role}`,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = profileRouter;
