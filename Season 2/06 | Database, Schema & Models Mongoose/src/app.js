const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");


// first connecting to database then allowing requests

connectDB()
  .then(() => {
    console.log("database connection establish");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => console.error(err));
