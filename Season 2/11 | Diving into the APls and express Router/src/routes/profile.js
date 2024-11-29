const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileData } = require("../utils/validation");

profileRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ error: "User no user exist" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong " + err.message });
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
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
    console.log("hi")
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, Your profile has been updated`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong " + err.message });
  }
});

profileRouter.delete("/user", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;

    if (!userId) {
      return res
        .status(404)
        .json({ error: "Email or username must be provided" });
    }

    const user = await User.findOneAndDelete({
      $or: [{ username: userId }, { email: userId }],
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).json({
      deletedUser: `User with username : ${user.username} and email : ${user.email} has been deleted`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong " + err.message });
  }
});

profileRouter.get("/user", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Email or username must be provided" });
    }

    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong " + err.message });
  }
});

module.exports = profileRouter;
