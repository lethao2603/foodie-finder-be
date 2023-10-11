/**
 * AppError is custom error for foodie finder. It has 4 parameters
 * <ul>
 * <li><code> statusCode</code>: HTTP status code </li>
 * <li><code> status</code>: either fail or success </li>
 * <li><code> errorCode</code>: error code send back to FE team. By this error,
 * fe dev can easily find out the cause of error </li>
 * <li><code> message</code>: message that describe console.error(); </li>
 * </ul>
 */

class AppError extends Error {
  constructor(statusCode, status, errorCode = "", message) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
    this.isOperational = true;
    this.errorCode = errorCode;
    // Capture the stack trace, excluding the constructor call from it.
    // Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
