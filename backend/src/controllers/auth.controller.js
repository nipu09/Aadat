const authService = require("../services/auth.service");
const { setAuthCookie, clearAuthCookie } = require("../utils/token");

exports.signup = async (req, res) => {
  const { email } = await authService.signup(req.body);
  res.status(201).json({
    message: "Account created. We've emailed you a verification code.",
    email,
    requiresVerification: true,
  });
};

exports.verifyEmail = async (req, res) => {
  const user = await authService.verifyEmail(req.body);
  setAuthCookie(res, user._id); // the person is logged in as soon as the email is verified
  res.status(200).json({ message: "Email verified", user: user.toPublic() });
};

exports.resendOtp = async (req, res) => {
  await authService.resendOtp(req.body);
  res.status(200).json({ message: "If this account needs verification, a new code has been sent." });
};

exports.login = async (req, res) => {
  const user = await authService.login(req.body);
  setAuthCookie(res, user._id);
  res.status(200).json({ message: "Logged in successfully", user: user.toPublic() });
};

exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
};

exports.me = (req, res) => {
  res.status(200).json({ user: req.user.toPublic() });
};
