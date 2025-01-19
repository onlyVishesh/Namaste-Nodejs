const User = require("../models/user");
const { isTokenValid } = require("../utils/validation");

const userAuth = async (req, res, next) => {
  try {
    //* Read the token from req cookies
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(500)
        .json({ success: false, error: "Session Expired, Please login again" });
    }
    //* validate the token
    const { _id } = await isTokenValid(token);

    //* find the user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(500).json({ success: false, error: "User not found" });
    }

    //* add user data to request object
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  userAuth,
};
