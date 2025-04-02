const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [messageSchema],
    lastMessage: {
      type: messageSchema, // embedded for fast access
    },
  },
  { timestamps: true }
);
// Get unread messages count for a given user
chatSchema.methods.getUnreadCountForUser = function (userId) {
  return this.messages.filter(
    (msg) => !msg.readBy.some((readerId) => readerId.equals(userId))
  ).length;
};

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
