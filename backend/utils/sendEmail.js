const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("EMAIL TRANSPORT READY");
  } catch (error) {
    console.error("EMAIL TRANSPORT VERIFY FAILED:", error);
  }

  return transporter;
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER or EMAIL_PASS is missing in environment");
    }

    if (!to || !subject || !html) {
      throw new Error("Missing email fields");
    }

    const mailer = await getTransporter();

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