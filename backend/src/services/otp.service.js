const crypto = require("crypto");
const env = require("../config/env");
const Otp = require("../models/Otp");
const AppError = require("../utils/AppError");
const { sendVerificationEmail } = require("./email.service");

const generateCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

// HMAC (keyed with the server secret) so a leaked DB can't be used to brute-force codes offline.
const hashCode = (userId, code) =>
  crypto.createHmac("sha256", env.jwtSecret).update(`${userId}:${code}`).digest("hex");

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

// Creates a fresh code for the user and emails it.
async function issueOtp(user) {
  const existing = await Otp.findOne({ user: user._id });
  if (existing) {
    const waitMs = existing.lastSentAt.getTime() + env.otp.resendCooldownSeconds * 1000 - Date.now();
    if (waitMs > 0) {
      throw new AppError(
        `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another code`,
        429,
        "OTP_COOLDOWN",
      );
    }
  }

  const code = generateCode();
  const now = new Date();

  await Otp.findOneAndUpdate(
    { user: user._id },
    {
      $set: {
        codeHash: hashCode(user._id, code),
        attempts: 0,
        lastSentAt: now,
        expiresAt: new Date(now.getTime() + env.otp.ttlMinutes * 60 * 1000),
      },
    },
    { upsert: true },
  );

  try {
    await sendVerificationEmail({ to: user.email, name: user.name, code });
  } catch (error) {
    await Otp.deleteOne({ user: user._id }); // don't start a cooldown for a mail that never left
    throw error;
  }
}

// Throws unless `code` is the user's current, unexpired code. Single-use.
async function verifyOtp(user, code) {
  // Atomically count the attempt first, so parallel guesses can't exceed the limit.
  const otp = await Otp.findOneAndUpdate(
    { user: user._id, expiresAt: { $gt: new Date() }, attempts: { $lt: env.otp.maxAttempts } },
    { $inc: { attempts: 1 } },
    { returnDocument: "after" },
  );

  if (!otp) {
    throw new AppError(
      "This code has expired or has too many wrong attempts. Please request a new one.",
      400,
      "OTP_EXPIRED",
    );
  }

  if (!safeEqual(otp.codeHash, hashCode(user._id, code))) {
    throw new AppError("Incorrect code. Please try again.", 400, "OTP_INVALID");
  }

  await Otp.deleteOne({ _id: otp._id });
}

module.exports = { issueOtp, verifyOtp };
