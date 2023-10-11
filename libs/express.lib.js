const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const AppError = require("../utils/appError.util");
const bodyParser = require("body-parser");
const app = express();
const globalErrorHandler = require("../controllers/globalError.controller");
// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set limited request
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(require("./../routes/index"));

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", undefined, `Undefined route: ${req.baseUrl}${req.path}`);
  next(err);
});
app.use(globalErrorHandler);

module.exports = app;
