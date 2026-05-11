const ApiError = require("../utils/errorhandler");
 
// Centralized error handling middleware
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Default error values
  if (!error.statusCode) {
    error = new ApiError(
      500,
      error.message || "Internal Server Error",
      error.errors || []
    );
  }

  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, "Validation Error", errors);
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new ApiError(
      400,
      `${field} already exists`,
      [`${field} must be unique`]
    );
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token", ["Token verification failed"]);
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired", ["Please login again"]);
  }

  // Handle Mongoose cast errors
  if (err.name === "CastError") {
    error = new ApiError(400, "Invalid ID format", [`Invalid ${err.path}`]);
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error Details:", {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    });
  }

  // Send response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorMiddleware;
