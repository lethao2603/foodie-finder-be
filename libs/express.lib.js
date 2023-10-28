const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const AppError = require("../utils/appError.util");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const app = express();
const globalErrorHandler = require("../controllers/globalError.controller");
const apiRoutes = require("./../routes/index");
// Allow Cross-Origin requests
app.use(cors());
// Set security HTTP headers
app.use(helmet());

//config file upload
// default options
app.use(fileUpload());

//config  req.body
app.use(express.json()) // for JSON
app.use(express.urlencoded({ extended: true})) // for form data

//config template engine
//configViewEngine(app);

// set limited request
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(apiRoutes);//router.use('/api', require('./apis'));

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", undefined, `Undefined route: ${req.baseUrl}${req.path}`);
  next(err);
});
app.use(globalErrorHandler);

module.exports = app;
