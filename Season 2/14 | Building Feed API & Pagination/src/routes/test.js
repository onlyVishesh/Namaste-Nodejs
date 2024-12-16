const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { userRole } = require("../middlewares/role");
const testRouter = express.Router();

testRouter.post("/admin", userAuth, userRole("admin"), (req, res) => {
  res.send("this is only for admin");
});
testRouter.post(
  "/moderator",
  userAuth,
  userRole("admin", "moderator"),
  (req, res) => {
    res.send("this is for admin and moderator");
  }
);
testRouter.post(
  "/user",
  userAuth,
  userRole("admin", "moderator", "user"),
  (req, res) => {
    res.send("this is for all");
  }
);

module.exports = testRouter;
