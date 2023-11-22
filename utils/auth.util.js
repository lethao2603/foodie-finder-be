const jwt = require("jsonwebtoken");
const AppError = require("./appError.util").default;
const {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  JWT_SECRET_KEY,
} = require("../constants/config.constant");

exports.signAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role.name }, JWT_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

exports.signRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

exports.verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(new AppError(401, "fail", "Invalid refresh token"));
      }
      resolve(decoded.id);
    });
  });
};

exports.checkAuthorities = (requiredRoles) => {
  return (req, res, next) => {
    // extract token
    let token ;
  }
} 