const dotenv = require("dotenv");
dotenv.config({
  path: ".env",
});

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;

const PORT = process.env.PORT;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const MONGODB_HOSTNAME = process.env.MONGODB_HOSTNAME;

const MONGODB_PORT = process.env.MONGODB_PORT;

const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;

const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;

const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

const EMAIL_HOST = process.env.EMAIL_HOST;

const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

const EMAIL_PORT = process.env.EMAIL_PORT;

const EMAIL_SECURE = process.env.EMAIL_SECURE;

const EMAIL_SENDER_USER = process.env.EMAIL_SENDER_USER;

const EMAIL_SENDER_PASS = process.env.EMAIL_SENDER_PASS;

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

const EMAIL_VERIFY_SUBJECT = "Xác nhận email cho tài khoản FoodieFinder"

const EMAIL_VERIFY_BODY = ""

const CLIENT_ERROR_MESSAGE = {
  11000: "Email is already exists.",
  89: "Network timeout.",
  "ERR_TOKEN_1": "Invalid refresh token",
  "ERR_LOGIN_1": "Email and password must be provided",
  "ERR_LOGIN_1": "Password must be provided",
  "ERR_LOGIN_2": "Email not found in the system",
  "ERR_LOGIN_3": "Incorrect password",

}

module.exports = {
  SERVER_HOSTNAME,
  PORT,
  JWT_SECRET_KEY,
  MONGODB_HOSTNAME,
  MONGODB_PORT,
  MONGODB_DATABASE,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  CLIENT_ERROR_MESSAGE,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_SERVICE,
  EMAIL_SENDER_USER,
  EMAIL_SENDER_PASS,
  CLIENT_BASE_URL,
  EMAIL_VERIFY_SUBJECT
};
