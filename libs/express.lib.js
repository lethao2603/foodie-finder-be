const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const AppError = require("../utils/appError.util");
const bodyParser = require("body-parser");
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const {initializeSocket} = require('../libs/socket.lib');
const http = require('http');

const app = express();
const sever = http.createServer(app);
const io = initializeSocket(sever);
const globalErrorHandler = require("../controllers/globalError.controller");
const apiRoutes = require("./../routes/index");
// Allow Cross-Origin requests
app.use(cors());
// Set security HTTP headers
app.use(helmet());

//config  req.body
app.use(express.json()) // for JSON
app.use(express.urlencoded({ extended: true})) // for form data
//app.use(cookieParser())

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

//Prevent parameter pollution
app.use(hpp({
  whitelist: ['seats', 'typeOfRes', 'averagePrice', 'timeOpen', 'timeClose']
}));

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", undefined, `Undefined route: ${req.baseUrl}${req.path}`);
  next(err);
});
app.use(globalErrorHandler);

module.exports = app;
