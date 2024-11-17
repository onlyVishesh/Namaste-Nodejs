const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },
});

// Pre-save middleware to set `updatedAt`
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model
const User = mongoose.model("User", userSchema);

module.exports = User;
