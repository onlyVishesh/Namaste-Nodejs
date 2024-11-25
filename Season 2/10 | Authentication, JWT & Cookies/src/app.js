const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const {
  validateSignUpData,
  validateLoginData,
} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    await user.save();
    res.status(200).send("User Added successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
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
      const token = user.getJWT()

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

app.get("/profile", async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/user", async (req, res) => {
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

app.get("/feed", async (req, res) => {
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

app.delete("/user", async (req, res) => {
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

app.patch("/user", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = email || username;

    const ALLOWED_UPDATE = [
      "username",
      "firstName",
      "lastName",
      "password",
      "avatar",
      "about",
      "skills",
      "dateOfBirth",
      "gender",
      "role",
      "status",
    ];
    const data = req.body;

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allow");
    }

    if (!userId) {
      return res
        .status(404)
        .json({ error: "Email or username must be provided" });
    }

    const user = await User.findOneAndUpdate(
      {
        $or: [{ username: userId }, { email: userId }],
      },
      data,
      { runValidators: true }
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json({
      updatedUser: `User with username : ${user.username} and email : ${user.email} has been Updated`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong " + err.message });
  }
});

connectDB()
  .then(() => {
    console.log("database connection establish");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => console.error(err));
