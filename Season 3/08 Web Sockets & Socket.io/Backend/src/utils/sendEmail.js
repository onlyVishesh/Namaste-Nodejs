const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, template) => {
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
          Data: template,
        },
        Text: {
          Charset: "UTF-8",
          Data: "You've received a new notification on DevRoot.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (toAddress, subject, htmlTemplate) => {
  const sendEmailCommand = createSendEmailCommand(
    toAddress,
    "vishesh@dev-root.xyz",
    subject,
    htmlTemplate
  );

  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
};

module.exports = { createSendEmailCommand, run };
