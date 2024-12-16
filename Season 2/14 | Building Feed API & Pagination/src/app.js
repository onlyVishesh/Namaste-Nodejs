const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

//* Middleware to parse incoming JSON requests and cookies
app.use(express.json());
app.use(cookieParser());

//* Routes for different API endpoints
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userConnection");

//* Using routers for handling different routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


//* Connect to the database and start the server once connected
const PORT = process.env.PORT || 3001
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  })
  .catch((err) => console.error(err));
