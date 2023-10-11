// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
const { CLIENT_ERROR_MESSAGE } = require("../constants/config.constant");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // errors which are created from AppError
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorCode: CLIENT_ERROR_MESSAGE[err.errorCode],
    });
  } else {
    // Errors which are not created from AppError. They can be db errors or unhandled errors
    console.error("Error: ", err);
    const errMessage = CLIENT_ERROR_MESSAGE[err.code] || "Some thing went wrong!!";
    res.status(err.statusCode).json({
      status: err.code || err.status,
      errorCode: err.code,
      message: errMessage,
    });
  }
};
