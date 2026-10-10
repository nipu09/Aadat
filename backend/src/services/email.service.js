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
      // Fail fast instead of hanging the request for ~2 minutes if the port is blocked
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

// "AAdat <me@example.com>" or "me@example.com" -> { name, email }
function parseFrom(from) {
  const m = /^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/.exec(from || "");
  return m ? { name: (m[1] || "AAdat").trim() || "AAdat", email: m[2].trim() } : { name: "AAdat", email: (from || "").trim() };
}

// Brevo transactional email over HTTPS (port 443) - works on hosts that block SMTP ports.
async function sendViaBrevoApi({ to, name, mail }) {
  let res;
  try {
    res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.brevoApiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: parseFrom(env.smtp.from),
        to: [{ email: to, name }],
        subject: mail.subject,
        htmlContent: mail.html,
        textContent: mail.text,
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("Brevo API request failed:", error.message);
    throw new AppError("We couldn't send the verification email. Please try again.", 502, "EMAIL_SEND_FAILED");
  }
  if (!res.ok) {
    console.error("Brevo API error:", res.status, await res.text().catch(() => ""));
    throw new AppError("We couldn't send the verification email. Please try again.", 502, "EMAIL_SEND_FAILED");
  }
}

async function sendVerificationEmail({ to, name, code }) {
  const mail = verificationEmail({ name, code, ttlMinutes: env.otp.ttlMinutes });

  if (env.brevoApiKey) {
    return sendViaBrevoApi({ to, name, mail });
  }

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
