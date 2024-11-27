const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");

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

module.exports = authRouter;
