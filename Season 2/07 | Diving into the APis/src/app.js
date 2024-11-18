const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;

  // creating a new instance of User Model and adding it to database
  const user = new User(userObj);
  try {
    await user.save();
    res.status(200).send("User Added successfully");
  } catch (err) {
    res.status(500).send("error saving the user" + err.message);
  }
});

// first connecting to database the allowing requests
connectDB()
  .then(() => {
    console.log("database connection establish");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => console.error(err));
