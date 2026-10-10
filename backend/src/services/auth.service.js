const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const otpService = require("./otp.service");

const BCRYPT_ROUNDS = 12;
// Compared against when the email doesn't exist, so response time doesn't reveal it.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_ROUNDS);

async function signup({ name, email, password }) {
  const existing = await User.findOne({ email }).select("+h_password");

  if (existing?.isVerified) {
    throw new AppError("Email is already registered", 409, "EMAIL_TAKEN");
  }

  const h_password = await bcrypt.hash(password, BCRYPT_ROUNDS);
  let user;

  if (existing) {
    // Abandoned, never-verified signup: let the person start over.
    existing.name = name;
    existing.h_password = h_password;
    user = await existing.save();
  } else {
    user = await User.create({ name, email, h_password });
  }

  await otpService.issueOtp(user);
  return { email: user.email };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+h_password");

  const matches = await bcrypt.compare(password, user ? user.h_password : DUMMY_HASH);
  if (!user || !matches) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (!user.isVerified) {
    // Correct password but unverified: send a fresh code (ignore the resend cooldown)
    try {
      await otpService.issueOtp(user);
    } catch (error) {
      if (error.code !== "OTP_COOLDOWN") throw error;
    }
    throw new AppError("Please verify your email to continue", 403, "EMAIL_NOT_VERIFIED");
  }

  return user;
}

async function verifyEmail({ email, otp }) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Incorrect code. Please try again.", 400, "OTP_INVALID");

  if (user.isVerified) {
    throw new AppError("This email is already verified. Please sign in.", 400, "ALREADY_VERIFIED");
  }

  await otpService.verifyOtp(user, otp);

  user.isVerified = true;
  await user.save();
  return user;
}

// Always resolves quietly for unknown/verified emails so this can't be used to probe accounts.
async function resendOtp({ email }) {
  const user = await User.findOne({ email });
  if (!user || user.isVerified) return;
  await otpService.issueOtp(user);
}

module.exports = { signup, login, verifyEmail, resendOtp };
