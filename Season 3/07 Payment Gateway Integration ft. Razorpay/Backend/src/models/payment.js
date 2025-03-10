const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config;

// Define the payment schema
// Added new validations and SchemaTypes
/* 
Structure of database must contain these data


"order": {
    "id": "order_QdQfBryfRLyesZ",
    "amount": 39900,
    "currency": "INR",
    "amount_due": 39900,
    "amount_paid": 0,
    "attempts": 0,
    "created_at": 1749107816,
    "entity": "order",
    "notes": {
        "firstName": "value3",
        "lastName": "value2",
        "plans": "value3"
    },
    "offer_id": null,
    "receipt": "receipt#1",
    "status": "created"
  }

*/
const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "failed",
        "authorized",
        "captured",
        "started",
        "resolved",
      ],
      default: "created",
    },
    receipt: {
      type: String,
      require: true,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      plan: {
        type: ["Starter", "Professional", "Enterprise"],
      },
    },
  },
  { timestamps: true }
);

//* Exporting the model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
