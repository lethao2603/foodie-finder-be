const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/auth.util");
const User = require("./../models/user.model");
const PersonalConfig = require("../models/personal-config.model");
const AppError = require("../utils/appError.util");
const { readJSONFile } = require("../data/fileUtils");
const {
  CLIENT_ERROR_MESSAGE,
  CLIENT_BASE_URL,
  EMAIL_VERIFY_SUBJECT,
} = require("../constants/config.constant");
const Token = require("../models/token.model");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail.util");
const { getVerifyEmailTemplate } = require("../utils/helper.util");
const Menu = require("../models/menu.model");
const Restaurant = require("../models/restaurant.model");
const { use } = require("../routes/apis/auth.route");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRS_IN,
  });
};

const createSendToken = (User, statusCode, res) => {
  const token = signToken(User._id);
  const cookieOptions = {
    expires: new Date(Date.now() + processe.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (pcocess.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  //Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
    newUser.password = undefined;
    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${CLIENT_BASE_URL}/verify?code=${newUser._id}-${token.token}`;
    await sendMail(newUser.email, EMAIL_VERIFY_SUBJECT, getVerifyEmailTemplate(url));
    res.status(201).send({
      status: "success",
      data: {
        // user: newUser,
        message: "An email sent to your account, please verify",
      },
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err,
    // });
    // console.log(err.message);
    if (!err.isOperational) {
      err = new AppError(404, "fail", undefined, err.message);
    }
    // console.log(err);
    next(err);
  }
};
//Login user and send jwt
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(404, "fail", "ERR_LOGIN_1", CLIENT_ERROR_MESSAGE.ERR_LOGIN_1);
    }

    const userDb = await User.findOne({ email: email }).select("+password");
    if (!userDb) {
      throw new AppError(404, "fail", "ERR_LOGIN_2", CLIENT_ERROR_MESSAGE.ERR_LOGIN_2);
    }
    if (!userDb.verified) {
      throw new AppError(404, "fail", undefined, "Email not verified");
    }
    if (!(await User.compare(password, userDb.password))) {
      throw new AppError(404, "fail", "ERR_LOGIN_3", CLIENT_ERROR_MESSAGE.ERR_LOGIN_3);
    }
    // console.log(password, userDb.password);
    const config = await PersonalConfig.findOne({ userId: userDb._id });
    if (config.firstTimeLogin) {
      await PersonalConfig.findByIdAndUpdate(config._id, { firstTimeLogin: false });
    }
    const token = signAccessToken(userDb);
    const refreshToken = signRefreshToken(userDb);
    userDb.password = undefined;

    res.status(200).send({
      status: "success",
      token,
      refreshToken,
      config,
      // data: {
      //   user: userDb,
      // },
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyLink = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      throw new AppError(404, "fail", undefined, "Invalid link");
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      throw new AppError(404, "fail", undefined, "Invalid link");
    }
    const userId = user._id;
    var config = {
      userId,
    };
    await PersonalConfig.create(config);
    await User.updateOne({ _id: user._id, verified: true });
    await token.remove();

    res.status(200).send({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {};
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new Error("Refresh token is required"));
    const id = await verifyRefreshToken(refreshToken);
    const userDb = await User.findById(id);
    const accessToken = signAccessToken(userDb);
    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};
exports.insertData = async (req, res, next) => {
  const dataMenu = readJSONFile(`Menu_${req.params.category}.json`);
  const dataRes = readJSONFile(`${req.params.category}.json`);
  for (let i = 0; i < dataMenu.length; i++) {
    // Goi ham insert
    const newMenu = await Menu.create(dataMenu[i]);
    const menu_id = newMenu._id;
    const res = {
      ...dataRes[i],
      resMenuInfor: menu_id,
    };
    // console.log(res.resname);
    const newRes = await Restaurant.create(res);
  }
  res.status(200).send({
    status: "success",
  });
};

exports.protect = async (req, res, next) => {
  // Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  // check token exprations

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  // Check if user still exists
  const currenUser = await User.findById(decoded.id);
  if (!currenUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401));
  }

  // Check if user changed password after the token was issued
  // if(currenUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('User recently changed password! Please log in in again.', 401))
  // };

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currenUser;
  next();
};

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    // role ['customer', 'restaurant-owner', 'admin']
    if (!role.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }
  // Generate the ramdom reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get("host")}/api/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password
  and password confirm to: ${resetURL}.\nIf you didn't forget your password, please ignore
  this email!`;

  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    User.passwordResetToken = undefined;
    User.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email. try again later!"), 500);
  }
};

exports.resetPassword = (req, res, next) => {};
