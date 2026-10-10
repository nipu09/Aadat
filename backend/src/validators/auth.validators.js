const { z } = require("zod");

const str = (msg) => z.string({ required_error: msg, invalid_type_error: msg });

const email = str("A valid email is required").trim().toLowerCase().email("A valid email is required");

const signupSchema = z.object({
  name: str("Name is required").trim().min(1, "Name is required").max(30, "Name must be 30 characters or fewer"),
  email,
  // bcrypt only uses the first 72 bytes, so cap the length
  password: str("Password is required").min(8, "Password must be at least 8 characters").max(72, "Password must be 72 characters or fewer"),
});

const loginSchema = z.object({
  email,
  password: str("Password is required").min(1, "Password is required"),
});

const verifyEmailSchema = z.object({
  email,
  otp: str("Enter the 6-digit code").regex(/^\d{6}$/, "Enter the 6-digit code"),
});

const resendOtpSchema = z.object({ email });

module.exports = { signupSchema, loginSchema, verifyEmailSchema, resendOtpSchema };
