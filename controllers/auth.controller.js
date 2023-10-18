const { signAccessToken, signRefreshToken } = require("../utils/auth.util");
const User = require("./../models/user.model");
const AppError = require("./../utils/appError.util");
const { CLIENT_ERROR_MESSAGE } = require("../constants/config.constant");
exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    newUser.password = undefined;
    res.status(200).send({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

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
    if (!(await User.compare(password, userDb.password))) {
      throw new AppError(404, "fail", "ERR_LOGIN_3", CLIENT_ERROR_MESSAGE.ERR_LOGIN_3);
    }

    const token = signAccessToken(userDb);
    userDb.password = undefined;

    res.status(200).send({
      status: "success",
      token,
      data: {
        user: userDb,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {};

exports.refreshToken = async (req, res, next) => {};
