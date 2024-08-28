function errorHandling(err, req, res, next) {
  console.log("🚀🚀🚀", { name: err.name, message: err.message });

  const errorMap = {
    ValidationError: { statusCode: 400, message: "Validation error" },
    NotFoundError: { statusCode: 404, message: "Not found" },
    ForbiddenError: { statusCode: 403, message: "Forbidden" },
    SequelizeValidationError: { statusCode: 400, message: "Validation error" },
    SequelizeUniqueConstraintError: { statusCode: 400, message: "Validation error" },
    Unauthenticated: { statusCode: 401, message: "Unauthenticated" },
    default: { statusCode: 500, message: "Internal server error" },
  };

  const { statusCode, message } = errorMap[err.name] || errorMap.default;
  const errorMessage = err.message || message;

  res.status(statusCode).json({ error: errorMessage });
}

module.exports = errorHandling;
