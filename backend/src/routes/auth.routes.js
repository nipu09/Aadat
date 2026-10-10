const router = require("express").Router();
const c = require("../controllers/auth.controller");
const requireLogin = require("../middleware/requireLogin");
const validate = require("../middleware/validate");
const { authLimiter, otpLimiter } = require("../middleware/rateLimiters");
const v = require("../validators/auth.validators");

router.post("/signup", authLimiter, validate(v.signupSchema), c.signup);
router.post("/login", authLimiter, validate(v.loginSchema), c.login);
router.post("/verify-email", otpLimiter, validate(v.verifyEmailSchema), c.verifyEmail);
router.post("/resend-otp", otpLimiter, validate(v.resendOtpSchema), c.resendOtp);
router.post("/logout", c.logout);
router.get("/me", requireLogin, c.me);

module.exports = router;
