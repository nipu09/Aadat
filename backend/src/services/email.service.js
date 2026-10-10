const nodemailer = require("nodemailer");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const verificationEmail = require("../templates/verificationEmail");

let transporter = null;

function getTransporter() {
  if (!env.smtp.host) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

async function sendVerificationEmail({ to, name, code }) {
  const mail = verificationEmail({ name, code, ttlMinutes: env.otp.ttlMinutes });
  const t = getTransporter();

  // Local development without SMTP: print the code in the server console.
  // (env.js makes SMTP mandatory in production, so this never runs there.)
  if (!t) {
    console.log(`\n[DEV EMAIL] Verification code for ${to}: ${code}\n`);
    return;
  }

  try {
    await t.sendMail({ from: env.smtp.from, to, ...mail });
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw new AppError("We couldn't send the verification email. Please try again.", 502, "EMAIL_SEND_FAILED");
  }
}

module.exports = { sendVerificationEmail };
