const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middlewares/auth");

const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

const PLANS = [
  {
    membershipType: "Starter",
    price: 399,
    features: [
      "10 Projects",
      "5 GB Storage",
      "Basic Support",
      "Email Assistance",
    ],
  },
  {
    membershipType: "Professional",
    price: 899,
    features: [
      "50 Projects",
      "20 GB Storage",
      "Priority Support",
      "Email & Chat Assistance",
      "API Access",
    ],
    isPopular: true,
  },
  {
    membershipType: "Enterprise",
    price: 1999,
    features: [
      "Unlimited Projects",
      "100 GB Storage",
      "24/7 Support",
      "Dedicated Account Manager",
      "API Access",
      "Advanced Analytics",
    ],
  },
];

paymentRoute.get("/payment/plans", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Plan Data Fetched",
      plansData: PLANS,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

paymentRoute.post("/payment/createOrder", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: (() => {
        const plan = PLANS.find((p) => p.membershipType === membershipType);
        return plan ? plan.price * 100 : 0; // price in rupees, convert to paisa
      })(),
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        // can give meta data here
        firstName,
        lastName,
        plan: membershipType,
      },
    });

    // save in database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: order.notes,
    });

    const savePayment = await payment.save();

    // return back my order to frontend

    res.status(200).json({
      success: true,
      message: "Order created",
      order: savePayment,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

paymentRoute.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get["X-Razorpay-Signature"];
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return req
        .status(400)
        .json({ success: false, error: "WebHook signature is not valid" });
    }

    // update the payment status in db

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    // update user membership 
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.plan;
    await user.save();

    if (req.body.event == "payment.captured") {
    }
    if (req.body.event == "payment.failed") {
    }

    // return success response 200 else webhook call again and again
    res
      .status(200)
      .json({ success: true, message: "Webhook received successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = paymentRoute;
