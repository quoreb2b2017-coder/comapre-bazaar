const ApiError = require("../utils/api-error");

const notFound = (_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = { notFound, errorHandler };
