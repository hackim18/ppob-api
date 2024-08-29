function errorHandling(err, req, res, next) {
  console.log("🚀🚀🚀", { name: err.name, message: err.message });

  const errorMap = {
    ZodError: { statusCode: 400, message: err.errors ? err.errors.map((e) => e.message).join(", ") : "Validation error" },
    ValidationError: { statusCode: 400, message: err.message || "Validation error" },
    NotFound: { statusCode: 404, message: err.message || "Not found" },
    ForbiddenError: { statusCode: 403, message: err.message || "Forbidden" },
    SequelizeValidationError: { statusCode: 400, message: err.errors ? err.errors[0].message : "Validation error" },
    SequelizeUniqueConstraintError: { statusCode: 400, message: err.message || "Validation error" },
    Unauthenticated: { statusCode: 401, message: err.message || "Unauthenticated" },
    Conflic: { statusCode: 409, message: err.message || "Conflict" },
    default: { statusCode: 500, message: err.message || "Internal server error" },
  };

  const { statusCode, message } = errorMap[err.name] || errorMap.default;
  res.status(statusCode).json({ message });
}

module.exports = errorHandling;
