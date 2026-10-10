// Single place that reads + validates environment variables.
// The app refuses to boot with a bad config instead of failing later at runtime.
const path = require("path");
const { z } = require("zod");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

    // Comma-separated list of allowed frontend origins (CORS)
    CLIENT_URL: z.string().default("http://localhost:3000"),
    APP_TIMEZONE: z.string().default("Asia/Kolkata"),

    // "lax" works when frontend + API share a site (recommended).
    // Use "none" only if they live on different sites (cookie is Secure in production).
    COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),

    OTP_TTL_MINUTES: z.coerce.number().positive().default(10),
    OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
    OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().int().nonnegative().default(60),

    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.NODE_ENV !== "production") return;
    for (const key of ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"]) {
      if (!v[key]) {
        ctx.addIssue({ code: "custom", path: [key], message: `${key} is required in production` });
      }
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const e = parsed.data;

module.exports = Object.freeze({
  nodeEnv: e.NODE_ENV,
  isProd: e.NODE_ENV === "production",
  port: e.PORT,
  mongoUri: e.MONGODB_URI,
  jwtSecret: e.JWT_SECRET,
  clientOrigins: e.CLIENT_URL.split(",").map((s) => s.trim()).filter(Boolean),
  timezone: e.APP_TIMEZONE,
  cookieSameSite: e.COOKIE_SAMESITE,
  otp: {
    ttlMinutes: e.OTP_TTL_MINUTES,
    maxAttempts: e.OTP_MAX_ATTEMPTS,
    resendCooldownSeconds: e.OTP_RESEND_COOLDOWN_SECONDS,
  },
  smtp: {
    host: e.SMTP_HOST,
    port: e.SMTP_PORT,
    user: e.SMTP_USER,
    pass: e.SMTP_PASS,
    from: e.EMAIL_FROM,
  },
});
