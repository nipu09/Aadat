const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const routes = require("./routes");
const { apiLimiter } = require("./middleware/rateLimiters");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Hosting platforms (Render, Railway, Fly, Heroku...) sit behind a proxy.
// Needed for correct client IPs (rate limiting) and Secure cookies.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.clientOrigins, credentials: true }));
app.use(morgan(env.isProd ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Health check for the hosting platform / uptime monitors
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api", apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
