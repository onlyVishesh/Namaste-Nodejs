const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middlewares/auth");

const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");

paymentRoute.get("/payment/plans", userAuth, async (req, res) => {
  const plans = [
    {
      title: "Starter",
      price: 399,
      features: [
        "10 Projects",
        "5 GB Storage",
        "Basic Support",
        "Email Assistance",
      ],
    },
    {
      title: "Professional",
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
      title: "Enterprise",
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
  try {
    res.status(200).json({
      success: true,
      message: "Plan Data Fetched",
      plansData: plans,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

paymentRoute.post("/payment/createOrder", userAuth, async (req, res) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: 39900, // this is in paisa
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        // can give meta data here
        firstName: "value3",
        lastName: "value2",
        plan: "value3",
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
    console.log(order);

    res.status(200).json({
      success: true,
      message: "Order created",
      order: savePayment,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = paymentRoute;
