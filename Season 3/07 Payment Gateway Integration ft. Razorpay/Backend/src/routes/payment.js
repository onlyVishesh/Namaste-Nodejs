const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middlewares/auth");

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
      plansData:plans,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = paymentRoute;
