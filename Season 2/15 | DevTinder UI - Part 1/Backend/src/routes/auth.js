require("dotenv").config;
const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");


//* To create account
authRouter.post("/signup", async (req, res) => {
  try {
    //* checking if req contains valid data
    validateSignUpData(req);
    const { username, firstName, lastName, email, password } = req.body;

    //* Creating password hash and saving it to data base
    const passwordHash = await bcrypt.hash(password, 10);
    const adminEmails = process.env.adminEmails
      ? process.env.adminEmails.split(",")
      : [];
    let user;
    if (adminEmails.includes(email)) {
      user = new User({
        username,
        firstName,
        lastName,
        email,
        password: passwordHash,
        role: "admin",
      });
    } else {
      user = new User({
        username,
        firstName,
        lastName,
        email,
        password: passwordHash,
      });
    }

    //? Need to add email otp verification

    await user.save();
    res.status(201).json({ message: "Account Created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//* To login user
authRouter.post("/login", async (req, res) => {
  try {
    //* checking if req contains valid data
    validateLoginData(req);
    const { username, email, password } = req.body;
    const userId = email || username;

    //* finding user using email/username
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid Credential" });
    }

    //* checking if password is valid
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //* JWT token created at user model
      const token = user.getJWT();

      //* adding the token to cookie and send back to user
      res.cookie("token", token);
      res.status(200).json({ message: "login successful" });
    } else {
      throw new Error("Invalid Credential");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//* To logout user
authRouter.post("/logout", async (req, res) => {
  //* expiring cookie to logout user
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "Logout successfully" });
});

//* To change password not not login
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

    //? need to add otp verification of userId

    const { password } = req.body;
    //* Adding password hash to user document
    if (validator.isStrongPassword(password)) {
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;

      await user.save();
      res.status(200).json({ message: "Password Has Been changed" });
    } else {
      throw new Error("Password is not strong");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//* To change password when login
authRouter.patch("/changePassword", userAuth, async (req, res) => {
  try {
    //* storing logged user data to loggedInUser
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }
    const { password, newPassword } = req.body;

    //* Adding password to user document
    if (validator.isStrongPassword(newPassword)) {
      const isPasswordValid = await loggedInUser.validatePassword(password);
      if (isPasswordValid) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();
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
