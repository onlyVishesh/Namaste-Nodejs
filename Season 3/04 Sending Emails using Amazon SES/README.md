<h1 style="text-align: center; display: flex; justify-content: space-between;">
  🚀 <span>Namaste Node.js -  04 Sending Emails using Amazon SES</span> 🚀
</h1>

## 📌 Quick Links

[![Frontend Repo](https://img.shields.io/badge/Frontend-Repository-green)](https://github.com/onlyVishesh/DevRoot-Frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue)](https://github.com/onlyVishesh/DevRoot-Backend)

---

## 📋 Table of Contents

- [📌 Quick Links](#-quick-links)
- [📋 Table of Contents](#-table-of-contents)
- [1. Create IAM User](#1-create-iam-user)
- [2. Sign Up for Amazon SES](#2-sign-up-for-amazon-ses)
- [3. Verify Domain with DNS Records](#3-verify-domain-with-dns-records)
- [4. Request Production Access](#4-request-production-access)
- [5. Set Up IAM Credentials](#5-set-up-iam-credentials)
- [6. Install AWS SDK v3](#6-install-aws-sdk-v3)
- [7. SES Client Setup](#7-ses-client-setup)
- [8. Send Email using SES](#8-send-email-using-ses)
- [9. Integrate into Project](#9-integrate-into-project)

---

Learn how to integrate Amazon SES (Simple Email Service) in your Node.js backend to send emails reliably and securely.

## 1. Create IAM User

1. Go to the AWS Console and search for **IAM (Identity and Access Management)**.
2. Click on **Users > Add Users**.
3. Enter a **username** of your choice.
4. Choose **Attach policies directly** and search for `AmazonSESFullAccess`.
5. Select the policy and click **Next** and then **Create User**.
6. Your IAM user is now ready!

---

## 2. Sign Up for Amazon SES

1. In the AWS Console, search for **SES**.
2. Click on **Get Started** or navigate to the **SES Dashboard**.
3. Go to **Verified Identities** and click **Create Identity**.
4. Choose **Domain** (recommended over Email) and enter your domain.
5. Use **Easy DKIM** and select your preferred key length.
6. Click **Create Identity**.

---

## 3. Verify Domain with DNS Records

1. SES will give you 3 **CNAME** records.
2. Go to your **Cloudflare DNS Settings**.
3. Click **Add Record**, choose **Type: CNAME**, and paste each record from SES.
4. **Important:** Turn off the **Proxy** (set to “DNS only”).
5. Wait a few minutes for SES to verify the domain. Once verified, status will show **Verified**.

---

## 4. Request Production Access

1. Go back to the **SES Dashboard**.
2. Click **Request Production Access**.
3. Choose **Mail Type: Transactional**.
4. Enter your project or website URL.
5. Submit the form – AWS will approve your request (may take a few hours).

---

## 5. Set Up IAM Credentials

1. Go to **IAM > Users > [Your User] > Security Credentials**.
2. Click **Create Access Key**.
3. Choose **Use Case: Other**.
4. Download or copy the **Access Key** and **Secret Key**.
5. Store them in your backend `.env` file:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_aws_region (e.g., us-east-1)
   ```

## 6. Install AWS SDK v3

Install the SES client package:

```bash
  npm install @aws-sdk/client-ses
```

## 7. SES Client Setup

Create a file sesClient.js:

```js
const { SESClient } = require("@aws-sdk/client-ses");
const REGION = "ap-south-1";
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
module.exports = { sesClient };
```

Reference Code:
👉 AWS SES Example Code [Link](https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses)
👉 AWS SES Client Example Code [Link](https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/libs/sesClient.js)
👉 AWS SES send email Example Code [Link](https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/ses_sendemail.js)

## 8. Send Email using SES

Create a file sendEmail.js:

```js
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "<h1>Hello World from HTML SES</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "Hello World from Text SES",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Subject - Hello World from HTML SES",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "recipient@example.com",
    "sender@example.com"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
```

✅ Note: Make sure the Source and Destination emails are verified in your SES sandbox.

## 9. Integrate into Project

Use the `sendEmail.run()` function wherever you want to send emails — e.g., after a form submission, user registration, etc.

If you found this guide helpful, please ⭐ star the repository!
