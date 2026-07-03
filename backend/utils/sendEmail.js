const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!to || !subject || !html) {
      throw new Error("Missing email fields");
    }

    const mailer = getTransporter();

    const info = await mailer.sendMail({
      from: `"ALQORA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};

module.exports = sendEmail;