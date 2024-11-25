const User = require("../models/user");
const { isTokenValid } = require("../utils/validation");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    // validate the token
    const { _id } = await isTokenValid(token);
    console.log(_id)

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  userAuth,
};
