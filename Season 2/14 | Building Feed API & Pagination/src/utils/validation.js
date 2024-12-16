const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateSignUpData = (res) => {
  //* taking user input
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

const isTokenValid = async (token) => {
  const decodedMessage = jwt.verify(token, process.env.secretJWT);
  return decodedMessage;
};

const validateProfileData = (req) => {
  const allowEditFields = [
    "username",
    "firstName",
    "lastName",
    "avatar",
    "about",
    "skills",
    "dateOfBirth",
    "gender",
    "role",
    "status",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowEditFields.includes(field)
  );

  const {
    username,
    firstName,
    lastName,
    avatar,
    about,
    skills,
    dateOfBirth,
    gender,
    status,
  } = req.body;
  //* add validation for each field
  if (username && (username.length > 30 || username < 3)) {
    throw new Error("username must be 3-30 characters");
  }
  if (firstName && (firstName.length > 25 || firstName.length < 3)) {
    throw new Error("First name must be 3-25 characters");
  }
  if (lastName && (lastName.length > 25 || lastName.length < 3)) {
    throw new Error("Last name must be 3-25 characters");
  }
  if (avatar && !validator.isURL(avatar)) {
    throw new Error("Invalid Profile URL");
  }
  if (about && about.length > 500) {
    throw new Error("About contain too many words");
  }
  if (skills && skills.length > 15) {
    throw new Error(
      "Too many skills, make number of skills less than or equal to 15"
    );
  }

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  isTokenValid,
  validateProfileData,
};
