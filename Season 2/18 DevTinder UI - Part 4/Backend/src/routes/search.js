require("dotenv").config;
const express = require("express");
const searchRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

//* Added search api to search user based on username, firstName, lastName or skills
searchRouter.get("/search", userAuth, async (req, res) => {
  try {
    //* storing logged user data to loggedInUser
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }
    const { query } = req.query;
    console.log(query);
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }
    const page =
      parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
    let limit =
      parseInt(req.query.limit) > 50
        ? 50
        : parseInt(req.query.limit) < 1
        ? 1
        : parseInt(req.query.limit) || 10;

    const result = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { skills: { $regex: query, $options: "i" } },
      ],
    })
      .select([
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      //* adding paging
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ message: "successful", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = searchRouter;
