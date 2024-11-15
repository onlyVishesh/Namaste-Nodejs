// Middleware to authorize admin users

const adminAuth = (req, res, next) => {
  // Simulate admin authorization logic
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    // Respond with an error if admin is unauthorized
    return res.status(401).send("Unauthorized request - Admin access required");
  }

  // Proceed to the next middleware or route handler if authorized
  next();
};

// Middleware to authorize regular users
const userAuth = (req, res, next) => {
  // Simulate user authorization logic
  const token = "user";
  const isUserAuthorized = token === "user";

  if (!isUserAuthorized) {
    // Respond with an error if user is unauthorized
    return res.status(401).send("Unauthorized request - User access required");
  }

  // Proceed to the next middleware or route handler if authorized
  next();
};

module.exports = { adminAuth, userAuth };
