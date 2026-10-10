const jwt = require("jsonwebtoken");
const env = require("../config/env");

const COOKIE_NAME = "token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const baseCookie = {
  httpOnly: true,
  sameSite: env.cookieSameSite,
  secure: env.isProd, // HTTPS only in production
};

function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { algorithm: "HS256", expiresIn: "7d" });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
}

function setAuthCookie(res, userId) {
  res.cookie(COOKIE_NAME, signToken(userId), { ...baseCookie, maxAge: SEVEN_DAYS_MS });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, baseCookie);
}

module.exports = { COOKIE_NAME, verifyToken, setAuthCookie, clearAuthCookie };
