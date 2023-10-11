const AppError = require("../utils/appError.util").default;
const { CLIENT_ERROR_MESSAGE } = require("../constants/config.constant");

/**
 * @description Here is example of controller function
 * @todo write logic here, inside the try block
 * AppError is custom error for foodie finder. It has 4 parameters
 * <ul>
 * <li><code> statusCode</code>: HTTP status code </li>
 * <li><code> status</code>: either fail or success </li>
 * <li><code> errorCode</code>: error code send back to FE team. By this error,
 * fe dev can easily find out the cause of error </li>
 * <li><code> message</code>: message that describe console.error(); </li>
 * </ul>
 *
 * incase we want to create an error, we should throw AppError instance.
 * By throw an error, we automatically delegate the handling exception to GlobalErrorController
 *
 */
exports.getSth = async (req, res, next) => {
  try {
    // if (true) {
    //   throw new AppError(401, "fail", "ERR_LOGIN_2", CLIENT_ERROR_MESSAGE.ERR_LOGIN_2)
    // }

    // successful response
    res.status(200).send({
      message: "Test route",
    });
  } catch (err) {
    next(err);
  }
};
