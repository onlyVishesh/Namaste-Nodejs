const crypto = require("crypto");

const getSecretRoomId = (loggedInUsername, userId) => {
  console.log([loggedInUsername,userId].sort())
  return crypto
    .createHash("sha256")
    .update([loggedInUsername, userId].sort().join("_"))
    .digest("hex");
};

module.exports = { getSecretRoomId };
