// An error we *expect* and can show to the client (wrong password, not found...).
// Anything else that reaches the error handler is treated as a bug (generic 500).
class AppError extends Error {
  constructor(message, status = 500, code) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

module.exports = AppError;
