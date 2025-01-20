const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config;

// Define the User schema
// Added new validations and SchemaTypes

const bannerUrls = [
  "https://images.all-free-download.com/images/graphicwebp/abstract_beach_cloud_dawn_evening_horizontal_599086.webp",
  "https://images.unsplash.com/photo-1598449356475-b9f71db7d847?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1543304216-b46be324b571?q=80&w=2181&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://cdn.fstoppers.com/styles/full/s3/media/2020/12/21/nando-vertical-horizontal-11.jpg",
  "https://plus.unsplash.com/premium_photo-1672116453014-58e0b56aa14c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1672116452619-59897f28a938?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const getRandomBanner = () => {
  const randomIndex = Math.floor(Math.random() * bannerUrls.length);
  return bannerUrls[randomIndex];
};

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Username too small"],
      maxLength: [30, "Username too large"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9_]+$/.test(value);
        },
        message:
          "Username can only contain alphabets, numbers, and underscores.",
      },
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: [25, "First name too large"],
      match: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: [25, "Last name too large"],
      match: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email address",
      },
      lowercase: true,
      trim: true,
      minLength: [3, "Email too small"],
      maxLength: [30, "Email too large"],
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message: "Password is not strong",
      },
    },
    avatar: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "Give string is not an URL",
      },
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    banner: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "Give string is not an URL",
      },
      default: getRandomBanner(),
    },
    headline: {
      type: String,
      maxLength: [220, "Too many words"],
      trim: true,
    },
    about: {
      type: String,
      maxLength: [500, "Too many words"],
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: function () {
          return this.skills.length < 16;
        },
        message:
          "Too many skills, make number of skills less than or equal to 15",
      },
    },
    dateOfBirth: {
      type: Date,
      // need to add minimum zero year old and max 150 years
    },
    age: {
      type: Number,
      get: function () {
        if (!this.dateOfBirth) return null;
        const diff = Date.now() - this.dateOfBirth.getTime();
        return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "deactivated", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);

//* Creating composite index and index
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ skills: 1 });

//* creating custom method to create JWT Token
userSchema.methods.getJWT = function () {
  // create a jwt
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.secretJWT,
    {
      expiresIn: "3d",
    }
  );

  return token;
};

//* creating custom method to validate password
userSchema.methods.validatePassword = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);
  return isPasswordValid;
};

//* Exporting the model
const User = mongoose.model("User", userSchema);

module.exports = User;
