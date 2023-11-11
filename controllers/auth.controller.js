const { promisify } = require("util");
const jwt = require("jsonwebtoken");
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
const Review = require("../models/review.model");
const { ObjectId } = require("mongodb");
// const Review = mongoose.model("Review");
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
    console.log(userDb);
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

exports.fakeDataUser = async (req, res, next) => {
  console.log("hi");
  const dataUser = readJSONFile(`NewDataCusomer.json`);
  for (let i = 0; i < dataUser.length; i++) {
    // Goi ham insert
    const newUser = await User.create(dataUser[i]);
  }
  // User.counterReset("6545f70d93aa62c488173fdf", function (err) {
  //   // Now the counter is 0
  // });
  res.status(200).send({
    status: "success",
  });
};

exports.fakeDataRating = async (req, res, next) => {
  console.log("hi");
  function generateRandomRating() {
    return Math.floor(Math.random() * 5) + 1;
  }
  const restaurantIds = await Restaurant.find().distinct("_id");
  const userIds = await User.find().distinct("_id");
  for (let i = 0; i < 300; i++) {
    const review = {
      rating: generateRandomRating(),
      resInfor: restaurantIds[Math.floor(Math.random() * restaurantIds.length)],
      cusInfor: userIds[Math.floor(Math.random() * userIds.length)],
    };
    const newReview = await Review.create(review);
  }
  res.status(200).send({
    status: "success",
  });
};

const fs = require("fs"); // Import thư viện fs

exports.fakeInputRCM = async (req, res, next) => {
  console.log("hi");
  try {
    const results = await Review.aggregate([
      {
        $group: {
          _id: "$cusInfor",
          reviews: {
            $push: {
              resInfor: "$resInfor",
              rating: "$rating",
            },
          },
        },
      },
    ]);
    console.log(results);
    // Chuyển kết quả thành chuỗi JSON
    const jsonResult = JSON.stringify({
      status: "success",
      data: results,
    });
    // Lưu kết quả vào một tệp JSON
    fs.writeFile("result.json", jsonResult, "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Lỗi trong quá trình lưu kết quả vào tệp JSON",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "Kết quả đã được lưu vào tệp result.json",
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Lỗi trong quá trình xử lý dữ liệu",
    });
  }
};

exports.fakeTransferRCM = async (req, res, next) => {
  console.log("hi");
  // const data = readJSONFile(`result.json`);
  // // Create an empty array to store output data
  // const outputData = [];
  // // Process the data to generate the output
  // for (const entry of data) {
  //   const user = await User.findOne({ _id: entry._id });
  //   // const user = await User.findOne({ _id: ObjectId(entry._id) });
  //   // console.log(user);
  //   // console.log(entry._id);
  //   for (const review of entry.reviews) {
  //     const restaurant = await Restaurant.findOne({ _id: review.resInfor });
  //     const user_numericId = user ? user.numericId : "N/A";
  //     const restaurant_numericId1 = restaurant ? restaurant.numericId1 : "N/A";
  //     const rating = review.rating;
  //     //Format the data and push it into the outputData array
  //     outputData.push(`${user_numericId}   ${restaurant_numericId1}   ${rating}`);
  //   }
  // }
  // // Join the outputData into a single string
  // const outputString = outputData.join("\n");
  // // Define the file path where you want to save the output
  // const outputPath = "output.txt";
  // // Write the output to a file
  // fs.writeFileSync(outputPath, outputString, "utf-8");
  // console.log(`Output saved to ${outputPath}`);

  res.status(200).send({
    status: "success",
  });
};

exports.updatedUniqueRestaurant = async (req, res, next) => {
  console.log("hi");
};
