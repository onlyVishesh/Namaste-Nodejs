const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

//* Creating composite index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//* creating pre save function to check if form and to user is same during saving
connectionRequestSchema.pre("save", function (next) {
  // checking if fromUserId is same as toUserId

  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You Could not send request to yourself");
  }

  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
