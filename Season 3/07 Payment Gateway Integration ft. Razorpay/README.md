<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js - 07 Payment Gateway Integration ft. Razorpay</span> 🚀
</h1>

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

---

## 📋 Table of Contents

1. create a premium page
2. create a api `/payment/plans` to get the data form the backend about the plans
3. Razorpay integration

   1. Install the Razorpay SDK.
   2. Create an initialize function in [`razorpay.js`](./Backend/src/utils/razorpay.js) located at `Backend/src/utils`.
   3. Generate API key and secret from [Account & Settings](https://dashboard.razorpay.com/app/website-app-settings/api-keys).
   4. Save the API key and secret in the `.env` file in the backend folder:

      ```bash
      RAZORPAY_KEY_ID=<YOUR_API_KEY>
      RAZORPAY_KEY_SECRET=<YOUR_API_KEY_SECRET>
      ```

   5. Create the `/payment/createOrder` endpoint to create an order using the initialize function, as shown in [`payment.js`](./Backend/src/routes/payment.js).
   6. Save the payment details in the payments collection
   7. Add this API to the payment button
   8. modify the api to take input like membershipType on the frontend and price according to the memberShip in the backend
   9. open razorpay dialog box by adding razorpay script in the frontend index.html and into the payment.js

   ```jsx
   const options = {
     key: "YOUR_KEY_ID", // Replace with your Razorpay key_id
     amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
     currency: "INR",
     name: "Acme Corp",
     description: "Test Transaction",
     order_id: "order_IluGWxBm9U8zJ8", // This is the order_id created in the backend
     callback_url: "http://localhost:3000/payment-success", // Your success URL
     prefill: {
       name: "Gaurav Kumar",
       email: "gaurav.kumar@example.com",
       contact: "9999999999",
     },
     theme: {
       color: "#F37254",
     },
   };

   const rzp = new window.Razorpay(options);
   rzp.open();
   ```

   10. now there will be testing payment dialog box open in your payment page

4. Create WebHook

   1. reference - https://razorpay.com/docs/webhooks/setup-edit-payments/
   2. Added url `https://dev-root.xyz/api/payment/webhook`
   3. Add a secret, select Active Events and click on create
   4. Add secret to `.env`

   ```bash
   RAZORPAY_WEBHOOK_SECRET = <YOUR_WEBHOOK_SECRET>
   ```

   5. create a API to check and validate payment status reference - https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/#15-verify-payment-signature,https://razorpay.com/docs/webhooks/validate-test/
   6. In `/payment/webhook` add

   ```jsx
   const {
     validateWebhookSignature,
   } = require("razorpay/dist/utils/razorpay-utils");
   paymentRoute.post("/payment/webhook", async (req, res) => {
     try {
       const webhookSignature = req.get("X-Razorpay-Signature");
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

       const paymentDetails = req.body.payload.payment.entity;

       const payment = await Payment.findOne({
         orderId: paymentDetails.order_id,
       });

       if (req.body.event == "payment.captured") {
         // update the payment status in db
         // update user membership
       }
       if (req.body.event == "payment.failed") {
         //show error page
       }

       // return success response 200 else webhook call again and again
       res
         .status(200)
         .json({ success: true, message: "Webhook received successfully" });
     } catch (err) {
       res.status(500).json({ success: false, error: err.message });
     }
   });
   ```

   7. payload reference - https://razorpay.com/docs/webhooks/payloads/payments/

## ⭐ If you found this guide helpful, please star the repository