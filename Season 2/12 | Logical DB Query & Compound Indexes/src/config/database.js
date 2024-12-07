require("dotenv").config();
const mongoose = require("mongoose");

// code to connect to mongoDB atlas
const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.name}:${process.env.password}@cluster0.7ccw1.mongodb.net/DevRoot`
  );
};

module.exports = { connectDB };
