const env = require("../config/env");
const AppError = require("../utils/AppError");

function notFound(req, res, next) {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
}

// Express 5 forwards rejected promises from async handlers here automatically.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message;
  let code = err.code;

  if (err.code === 11000) {
    status = 409;
    message = "That record already exists";
    code = "DUPLICATE";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON body";
    code = "BAD_JSON";
  } else if (err.name === "ValidationError" || err.name === "CastError") {
    status = 400;
    message = "Invalid data";
    code = "VALIDATION_ERROR";
  }

  if (typeof code !== "string") code = undefined; // drop driver-specific numeric codes

  if (status >= 500) {
    console.error(`${req.method} ${req.originalUrl} ->`, err);
    if (env.isProd) message = "Something went wrong. Please try again.";
  }

  res.status(status).json({ message, ...(code && { code }) });
}

module.exports = { notFound, errorHandler };
