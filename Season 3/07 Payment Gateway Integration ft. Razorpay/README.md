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
   6. Add this API to the payment button

## ⭐ If you found this guide helpful, please star the repository
