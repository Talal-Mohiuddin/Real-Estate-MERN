class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(400, message);
  }
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please try again";
    err = new ErrorHandler(400, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "Token expired. Please try again";
    err = new ErrorHandler(400, message);
  }
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(404, message);
  }
  const errorMessage = err.errors  ? Object.values(err.errors).map((val) => val.message).join("  ") : err.message;


  return res.status(err.statusCode).json({
    message: errorMessage,
    statusCode: err.statusCode,
    success: false,
  });
};

export { ErrorHandler, errorMiddleware };
