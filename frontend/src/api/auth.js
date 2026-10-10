import { request, post } from "./client.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

export const auth = {
  // GET /api/auth/me → user | null
  async me() {
    try {
      return (await request("/api/auth/me")).user;
    } catch (error) {
      if (error.status === 401) return null; // simply "not logged in"
      throw error;
    }
  },

  // POST /api/auth/signup → { email }   (does NOT log in; a code is emailed)
  async signup(name, email, password) {
    const data = await post("/api/auth/signup", {
      name: name.trim(),
      email: normalizeEmail(email),
      password,
    });
    return { email: data.email };
  },

  // POST /api/auth/verify-email → user   (logs in on success)
  async verifyEmail(email, otp) {
    const data = await post("/api/auth/verify-email", { email: normalizeEmail(email), otp });
    return data.user;
  },

  // POST /api/auth/resend-otp
  async resendOtp(email) {
    await post("/api/auth/resend-otp", { email: normalizeEmail(email) });
  },

  // POST /api/auth/login → user. Throws error.code === "EMAIL_NOT_VERIFIED" if unverified.
  async login(email, password) {
    const data = await post("/api/auth/login", { email: normalizeEmail(email), password });
    return data.user;
  },

  // POST /api/auth/logout
  async logout() {
    await post("/api/auth/logout");
  },
};
