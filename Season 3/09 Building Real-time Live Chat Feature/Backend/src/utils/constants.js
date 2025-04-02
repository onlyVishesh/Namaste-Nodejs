const crypto = require("crypto");

const getSecretRoomId = (loggedInUsername, userId) => {
  return crypto
    .createHash("sha256")
    .update([loggedInUsername, userId].sort().join("_"))
    .digest("hex");
};

module.exports = { getSecretRoomId };
