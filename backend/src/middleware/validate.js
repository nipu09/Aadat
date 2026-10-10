const AppError = require("../utils/AppError");

// validate(schema)            -> checks req.body (and replaces it with the cleaned data)
// validate(schema, "params")  -> checks req.params
const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source] ?? {});
  if (!result.success) {
    return next(new AppError(result.error.issues[0].message, 400, "VALIDATION_ERROR"));
  }
  if (source === "body") req.body = result.data;
  next();
};

module.exports = validate;
