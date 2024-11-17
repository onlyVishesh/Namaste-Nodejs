const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    username: "onlyVishesh",
    firstName: "Vishesh",
    email: "okVishesh360@gmail.com",
    password: "vishesh1234",
    avatar: "https://avatars.githubusercontent.com/u/121187728?v=4",
    role: "admin",
  };

  // creating a new instance of User Model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("error saving the user" + err.message);
  }
});

// first connecting to database then allowing requests

connectDB()
  .then(() => {
    console.log("database connection establish");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => console.error(err));
