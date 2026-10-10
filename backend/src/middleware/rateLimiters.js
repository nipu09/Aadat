const rateLimit = require("express-rate-limit");

const make = ({ windowMinutes, limit, message }) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message, code: "RATE_LIMITED" },
  });

// Whole API
const apiLimiter = make({ windowMinutes: 15, limit: 600, message: "Too many requests. Please slow down." });

// Signup / login (password guessing, account spam)
const authLimiter = make({ windowMinutes: 15, limit: 20, message: "Too many attempts. Try again in a few minutes." });

// Verify code / resend code (email bombing, code guessing)
const otpLimiter = make({ windowMinutes: 15, limit: 10, message: "Too many code requests. Try again in a few minutes." });

module.exports = { apiLimiter, authLimiter, otpLimiter };
