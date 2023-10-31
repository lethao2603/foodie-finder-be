const { signAccessToken, signRefreshToken } = require("../utils/auth.util");
const User = require("./../models/user.model");
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
const { stringify } = require("querystring");
exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
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
    console.log(password, userDb.password);
    const token = signAccessToken(userDb);
    userDb.password = undefined;

    res.status(200).send({
      status: "success",
      token,
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
exports.refreshToken = async (req, res, next) => {};
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

exports.updateField = async (req, res, next) => {
  Restaurant.find({}).then(async (data) => {
    let i = 0;
    for (item of data) {
      const id = item._id;
      await Restaurant.findByIdAndUpdate(id, { numericId: i }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
        }
      });
      i++;
    }
  });
  res.status(200).send({
    status: "success",
  });
};
