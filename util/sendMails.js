const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const templateSource = fs.readFileSync(
  path.join(__dirname, "otpEmailTemplate.hbs"),
  "utf8"
);
const template = handlebars.compile(templateSource);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

const sendMail = async (recEmail, otp) => {
  let message = {
    from: `no_reply <${process.env.EMAIL_USER}>`,
    to: `Recipient <${recEmail}>`,
    subject: "Here is your OTP.",
    text: "This is your OTP. Please do not share it with anyone. It is valid for 5 minutes.",
    html: template({ otp }),
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return;
    }

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
};

module.exports = sendMail;
