require("dotenv").config();
const mongoose = require("mongoose");

// code to connect to mongoDB atlas
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.connectionString);
    console.log(
      `Database connected : ${connect.connection.host}, ${connect.connection.name}`
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = { connectDB };
