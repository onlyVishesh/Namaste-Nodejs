const validator = require("validator");

const validateSignUpData = (res) => {
  const { username, firstName, email, password } = res.body;

  if (!username) {
    throw new Error("Enter a username");
  } else if (username.length > 30 || username.length < 3) {
    throw new Error("Username must be 3-30 characters");
  } else if (!firstName) {
    throw new Error("Enter a name");
  } else if (firstName.length > 25 || firstName.length < 3) {
    throw new Error("First name must be 3-25 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateLoginData = (res) => {
  const { username, email, password } = res.body;

  if (!username) {
    if (!email) {
      throw new Error("Enter a UserId");
    }
  } else if (username && !email) {
    if (username.length > 30 || username < 3) {
      throw new Error("username must be 3-30 characters");
    }
  } else if (!username && email) {
    if (!validator.isEmail(email)) {
      throw new Error("Enter a valid email");
    }
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

module.exports = { validateSignUpData, validateLoginData };
