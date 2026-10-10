const User = require("../models/User");
const AppError = require("../utils/AppError");
const { COOKIE_NAME, verifyToken } = require("../utils/token");

async function requireLogin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new AppError("Please log in first", 401, "NO_SESSION");

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AppError("Invalid or expired session. Please log in again.", 401, "INVALID_SESSION");
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new AppError("User no longer exists", 401, "INVALID_SESSION");
  if (!user.isVerified) throw new AppError("Please verify your email", 403, "EMAIL_NOT_VERIFIED");

  req.user = user;
  next();
}

module.exports = requireLogin;
