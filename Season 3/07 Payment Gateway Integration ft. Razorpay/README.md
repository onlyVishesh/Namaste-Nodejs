<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 07: Payment Gateway Integration ft. Razorpay</span> 🚀
</h1>
Welcome to the seventh part of the Namaste Node.js series! In this module, you'll learn how to integrate a payment gateway into your Node.js application using Razorpay, one of India's leading payment solution providers.

---

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

---

## 📋 Table of Contents

- [📌 Quick Links](#-quick-links)
- [📋 Table of Contents](#-table-of-contents)
- [Introduction to Payment Gateways](#introduction-to-payment-gateways)
- [Setting Up Razorpay](#setting-up-razorpay)
  - [1. Create a Razorpay Account](#1-create-a-razorpay-account)
  - [2. Generate API Keys](#2-generate-api-keys)
  - [3. Install the Razorpay SDK](#3-install-the-razorpay-sdk)
  - [4. Set Environment Variables](#4-set-environment-variables)
- [Backend Implementation](#backend-implementation)
  - [1. Initialize Razorpay](#1-initialize-razorpay)
  - [2. Create Membership Plans API](#2-create-membership-plans-api)
  - [3. Create Order Creation Endpoint](#3-create-order-creation-endpoint)
- [Frontend Implementation](#frontend-implementation)
  - [1. Create a Premium Page Component](#1-create-a-premium-page-component)
  - [2. Fetch Plans from Backend](#2-fetch-plans-from-backend)
  - [3. Add Razorpay Script to HTML](#3-add-razorpay-script-to-html)
  - [4. Create Payment Handler](#4-create-payment-handler)
- [Webhooks for Payment Verification](#webhooks-for-payment-verification)
  - [1. Set Up Webhook in Razorpay Dashboard](#1-set-up-webhook-in-razorpay-dashboard)
  - [2. Add Webhook Secret to Environment Variables](#2-add-webhook-secret-to-environment-variables)
  - [3. Create Webhook Endpoint](#3-create-webhook-endpoint)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Introduction to Payment Gateways

A payment gateway is a service that authorizes credit card payments and enables online transactions. Razorpay is a popular payment gateway in India that provides a robust API for integrating payment solutions into your web applications.

**Why Razorpay?**

- Easy integration with comprehensive documentation
- Support for multiple payment methods (credit/debit cards, UPI, wallets, etc.)
- Dashboard for transaction monitoring
- Webhook support for automated transaction verification
- Customizable checkout pages

---

## Setting Up Razorpay

### 1. Create a Razorpay Account

- Sign up at [Razorpay.com](https://razorpay.com)
- Complete the KYC verification process
- Once approved, you'll get access to the dashboard

### 2. Generate API Keys

- Navigate to [Account & Settings > API Keys](https://dashboard.razorpay.com/app/website-app-settings/api-keys)
- Generate a new pair of Test Mode API keys for development
- Note down the Key ID and Key Secret

### 3. Install the Razorpay SDK

```bash
npm install razorpay
```

### 4. Set Environment Variables

In your `.env` file:

```bash
RAZORPAY_KEY_ID=<YOUR_API_KEY>
RAZORPAY_KEY_SECRET=<YOUR_API_KEY_SECRET>
```

---

## Backend Implementation

### 1. Initialize Razorpay

Create a utility file `Backend/src/utils/razorpay.js`:

```js
const Razorpay = require("razorpay");

const initialize = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

module.exports = { initialize };
```

### 2. Create Membership Plans API

Create an endpoint to fetch available membership plans:

```js
// Backend/src/routes/payment.js
router.get("/payment/plans", async (req, res) => {
  try {
    const plans = [
      { id: "basic", name: "Basic Plan", price: 499, duration: "1 month" },
      { id: "pro", name: "Pro Plan", price: 999, duration: "3 months" },
      { id: "premium", name: "Premium Plan", price: 1999, duration: "1 year" },
    ];

    res.status(200).json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

### 3. Create Order Creation Endpoint

```js
// Backend/src/routes/payment.js
const { initialize } = require("../utils/razorpay");

router.post("/payment/createOrder", authenticate, async (req, res) => {
  try {
    const { membershipType } = req.body;

    // Get plan price based on membership type
    const planPrices = {
      basic: 499 * 100, // in paise
      pro: 999 * 100,
      premium: 1999 * 100,
    };

    const amount = planPrices[membershipType] || 499 * 100; // default to basic

    const razorpay = initialize();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        membershipType,
        userId: req.user._id,
      },
    });

    // Save order details in database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      membershipType,
      status: "created",
    });

    await payment.save();

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

---

## Frontend Implementation

### 1. Create a Premium Page Component

Create a page to display membership plans and handle the payment process.

### 2. Fetch Plans from Backend

```jsx
useEffect(() => {
  async function fetchPlans() {
    try {
      const response = await fetch("/api/payment/plans");
      const data = await response.json();
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  }

  fetchPlans();
}, []);
```

### 3. Add Razorpay Script to HTML

In your `index.html` file:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 4. Create Payment Handler

```jsx
const handlePayment = async (plan) => {
  try {
    // Create order on backend
    const response = await fetch("/api/payment/createOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ membershipType: plan.id }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Could not create order");
    }

    // Configure Razorpay options
    const options = {
      key: data.key_id,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "DevRoot Premium",
      description: `${plan.name} Membership`,
      order_id: data.order.id,
      handler: function (response) {
        // Handle successful payment
        alert("Payment successful! Order ID: " + response.razorpay_order_id);
        // Redirect to success page or update UI
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || "",
      },
      theme: {
        color: "#1B2635",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed: " + error.message);
  }
};
```

---

## Webhooks for Payment Verification

Webhooks allow automatic verification of payment status without relying on client-side confirmation.

### 1. Set Up Webhook in Razorpay Dashboard

- Go to [Settings > Webhooks](https://dashboard.razorpay.com/app/website-app-settings/webhooks)
- Add a new webhook with URL: `https://your-domain.com/api/payment/webhook`
- Select events: `payment.captured`, `payment.failed`
- Generate and add a webhook secret

### 2. Add Webhook Secret to Environment Variables

```bash
RAZORPAY_WEBHOOK_SECRET=<YOUR_WEBHOOK_SECRET>
```

### 3. Create Webhook Endpoint

```js
// Backend/src/routes/payment.js
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

router.post("/payment/webhook", async (req, res) => {
  try {
    // Verify webhook signature
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid webhook signature" });
    }

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, error: "Payment not found" });
    }

    // Handle payment events
    switch (req.body.event) {
      case "payment.captured":
        // Update payment status
        payment.status = "completed";
        payment.paymentId = paymentDetails.id;
        payment.paymentMethod = paymentDetails.method;
        await payment.save();

        // Update user membership
        const user = await User.findById(payment.userId);
        if (user) {
          user.membership = payment.membershipType;
          user.membershipStartDate = new Date();

          // Set expiry based on plan
          const expiryMap = {
            basic: 30, // days
            pro: 90,
            premium: 365,
          };

          const days = expiryMap[payment.membershipType] || 30;
          user.membershipExpiryDate = new Date(
            new Date().getTime() + days * 24 * 60 * 60 * 1000
          );

          await user.save();
        }
        break;

      case "payment.failed":
        payment.status = "failed";
        await payment.save();
        break;

      default:
        // Handle other events
        break;
    }

    // Always return 200 to acknowledge receipt
    return res
      .status(200)
      .json({ success: true, message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Webhook error:", err);
    // Still return 200 to prevent Razorpay from retrying
    return res
      .status(200)
      .json({ success: false, message: "Error processing webhook" });
  }
});
```

---

## Best Practices

1. **Always Verify Payments Server-Side**:

   - Never rely solely on client-side verification
   - Always confirm payments through webhooks or direct API calls

2. **Handle Failed Transactions**:

   - Implement proper error handling
   - Provide a clear path for users to retry payments

3. **Test Thoroughly**:

   - Use Razorpay's test mode before going live
   - Test different payment scenarios (success, failure, abandoned)

4. **Secure API Keys**:

   - Never expose your Key Secret on the client-side
   - Only use the Key ID for client-side integration

5. **Monitor Transactions**:
   - Regularly check the Razorpay dashboard
   - Set up alerts for payment failures or disputes

---

## Troubleshooting

- **Order Creation Failed**: Verify API keys and check if your account is activated
- **Webhook Not Receiving Events**: Ensure the webhook URL is publicly accessible
- **Payment Failed**: Check the error message in the Razorpay dashboard
- **Signature Verification Failed**: Ensure webhook secret matches the one in dashboard

---

> ⭐ If you found this guide helpful, please star the repository
