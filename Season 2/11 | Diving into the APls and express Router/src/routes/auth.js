const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { username, firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    //* Need to add email otp verification

    await user.save();
    res.status(200).send("User Added successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { username, email, password } = req.body;
    const userId = email || username;

    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid Credential" });
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // JWT token created at user model
      const token = user.getJWT();

      // add the token to cookie and send back to user
      res.cookie("token", token);
      res.status(200).send("login successful");
    } else {
      throw new Error("Invalid Credential");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).send("Logout successfully");
});

authRouter.patch("/forgetPassword", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid Credential" });
    }
    //* need to add otp verification of userId

    const { password } = req.body;
    console.log(password);

    if (validator.isStrongPassword(password)) {
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;
      user.save();
      res.status(200).json({ message: "Password Has Been changed" });
    } else {
      throw new Error("Password is not strong");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
authRouter.patch("/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: "Please login again" });
    }
    const { password, newPassword } = req.body;

    if (validator.isStrongPassword(newPassword)) {
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        console.log(passwordHash);
        user.password = passwordHash;
        user.save();
        res.status(200).json({ message: "Password Has Been changed" });
      } else {
        throw new Error("Password is incorrect");
      }
    } else {
      throw new Error("Password is not strong");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = authRouter;
