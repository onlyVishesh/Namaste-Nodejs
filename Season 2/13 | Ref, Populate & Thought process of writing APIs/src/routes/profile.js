const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileData } = require("../utils/validation");

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

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Update not allow");
    }

    const loggedInUser = req.user;
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
      const { deletedCount } = await User.deleteOne({ _id: user._id });
      //* need to remove user from all the connections and remove all the connection request
      if (deletedCount === 1) {
        res.status(200).json({
          message: `Account with username : ${user.username} and email : ${user.email} has been deleted`,
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

profileRouter.patch("/profile/changeStatus", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }

    const { status, password } = req.body;

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Invalid password. Please try again." });
    }

    // Handle banned status
    if (user.status === "banned") {
      return res.status(403).json({
        message: `${user.firstName}, your account has been banned. Contact admin for more details.`,
      });
    }
    if (status === "banned") {
      return res.status(403).json({
        message: `${user.firstName}, you need to be an admin or moderator to ban a user.`,
      });
    }

    // Ensure `status` is valid
    if (!["active", "deactivated"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Use 'active' or 'deactivated'." });
    }

    // Handle status change logic
    if (user.status === status) {
      const message =
        status === "active"
          ? "Your account is already active."
          : "Your account is already deactivated.";
      return res.status(200).json({ message });
    }

    // Update the user's status
    user.status = status;
    await user.save();
    const message =
      status === "active"
        ? "Your account has been reactivated."
        : "Your account has been deactivated.";
    return res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

profileRouter.get("/profile/:userId", async (req, res) => {
  try {
    const {userId} = req.params

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Username must be provided" });
    }

    const user = await User.findOne({username: userId});

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = profileRouter;
