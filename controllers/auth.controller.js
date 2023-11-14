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
const json2csv = require("json2csv");
const csvjson = require("csvjson");
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

// exports.fakeDataRating = async (req, res, next) => {
//   console.log("hi");
//   console.log("Tạo dữ liệu giả mạo cho đánh giá");

//   function generateRandomRating() {
//     return Math.floor(Math.random() * 5) + 1;
//   }

//   try {
//     // Lấy tất cả ID của collection user và restaurant
//     const userIds = await User.find().distinct("_id");
//     const restaurantIds = await Restaurant.find().distinct("_id");

//     const reviews = [];

//     // Mỗi người dùng đánh giá cho 20 nhà hàng
//     for (let i = 0; i < userIds.length; i++) {
//       for (let j = 0; j < 3; j++) {
//         const cusInfor = userIds[i];
//         const resInfor = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
//         const rating = generateRandomRating();

//         reviews.push({
//           rating,
//           resInfor,
//           cusInfor,
//         });
//       }
//     }

//     // Sắp xếp lại mảng để tạo sự ngẫu nhiên trong đánh giá
//     for (let i = reviews.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
//     }

//     // Chèn đánh giá vào cơ sở dữ liệu
//     await Review.create(reviews);

//     res.status(200).send({
//       status: "success",
//       message: "Dữ liệu giả mạo cho đánh giá đã được tạo thành công",
//     });
//   } catch (error) {
//     console.error("Lỗi khi tạo dữ liệu giả mạo:", error);
//     res.status(500).send({
//       status: "error",
//       message: "Lỗi máy chủ nội bộ",
//     });
//   }
// };
exports.fakeDataRating = async (req, res, next) => {
  console.log("Tạo dữ liệu giả mạo cho đánh giá");

  function generateRandomRating() {
    return Math.floor(Math.random() * 5) + 1;
  }

  try {
    // Lấy tất cả ID của collection user và restaurant
    const userIds = await User.find().distinct("_id");
    const restaurantIds = await Restaurant.find().distinct("_id");

    const reviews = [];

    // Lấy một nửa ngẫu nhiên từ danh sách đầy đủ
    const halfUserIds = userIds.slice(0, Math.floor(userIds.length / 4));
    // const halfUserIds = userIds.slice(0, Math.floor(userIds.length / 2));
    // Mỗi người dùng đánh giá cho 20 nhà hàng
    for (let i = 0; i < halfUserIds.length; i++) {
      for (let j = 0; j < 10; j++) {
        const cusInfor = halfUserIds[i];
        const resInfor = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
        const rating = generateRandomRating();

        reviews.push({
          rating,
          resInfor,
          cusInfor,
        });
      }
    }

    // Sắp xếp lại mảng để tạo sự ngẫu nhiên trong đánh giá
    for (let i = reviews.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
    }

    // Chèn đánh giá vào cơ sở dữ liệu
    await Review.create(reviews);

    res.status(200).send({
      status: "success",
      message: "Dữ liệu giả mạo cho đánh giá đã được tạo thành công",
    });
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu giả mạo:", error);
    res.status(500).send({
      status: "error",
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

exports.fakeDataRatingforOneUser = async (req, res, next) => {
  console.log("hi");
  async function generateRandomRating() {
    return Math.floor(Math.random() * 5) + 1;
  }

  async function generateRandomRestaurantId() {
    const restaurantIds = await Restaurant.find().distinct("_id");
    return restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
  }
  async function generateRandomReview(cusInfor) {
    const rating = await generateRandomRating();
    const resInfor = await generateRandomRestaurantId();

    return {
      rating,
      resInfor,
      cusInfor,
    };
  }
  async function generateFakeReviews(cusInfor, numberOfReviews) {
    const reviews = [];
    for (let i = 0; i < numberOfReviews; i++) {
      const review = await generateRandomReview(cusInfor);
      reviews.push(review);
    }
    await Review.create(reviews);
  }
  await generateFakeReviews("6550f6c2890e551ff8d36baf", 15);
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
  try {
    // Bước 1: Group và Count
    const groupedDocs = await Restaurant.aggregate([
      {
        $group: {
          _id: "$resname",
          count: { $sum: 1 },
          docs: { $push: "$_id" },
        },
      },
      // Bước 2: Lọc những nhóm có số lượng lớn hơn 1
      {
        $match: {
          count: { $gt: 1 },
        },
      },
      // // Bước 3: Lọc và Xóa Documents Dư Thừa
      // {
      //   $lookup: {
      //     from: "restaurants",
      //     localField: "docs",
      //     foreignField: "_id",
      //     as: "duplicateDocs",
      //   },
      // },
      // {
      //   $unwind: "$duplicateDocs",
      // },
      // {
      //   $project: {
      //     _id: "$duplicateDocs._id",
      //   },
      // },
      // {
      //   $group: {
      //     _id: null,
      //     docs: { $push: "$_id" },
      //   },
      // },
      // {
      //   $project: {
      //     _id: 0,
      //     docs: 1,
      //   },
      // },
      // {
      //   $match: {
      //     docs: { $exists: true, $ne: [] },
      //   },
      // },
    ]);
    console.log(groupedDocs);

    // if (groupedDocs.length > 0 && groupedDocs[0].docs.length > 0) {
    //   // Bước 4: Xóa Documents Dư Thừa
    //   await Restaurant.deleteMany({ _id: { $in: groupedDocs[0].docs } });
    //   console.log("Đã xóa các documents trùng lặp thành công.");
    // } else {
    //   console.log("Không có documents trùng lặp để xóa.");
    // }
  } catch (error) {
    console.error("Lỗi:", error);
  }
  res.status(200).send({
    status: "success",
  });
};

exports.exportFieldsToCSV = async (req, res, next) => {
  console.log("hi");
  // Restaurant.countDocuments({}, (err, count) => {
  //   if (err) {
  //     console.error("Lỗi khi đếm tài liệu:", err);
  //   } else {
  //     console.log('Số lượng tài liệu trong collection "restaurant":', count);
  //   }
  // });
  const restaurants = await Restaurant.find({});
  // console.log(restaurants);
  const reviews = await Review.find({});
  // Lưu dữ liệu vào một mảng
  const restaurantArray = restaurants.map((restaurant) => ({
    id: restaurant._id.toString(),
    resname: restaurant.resname,
  }));
  const reviewArray = reviews.map((reviews) => ({
    cusInfor: reviews.cusInfor.toString(),
    resInfor: reviews.resInfor.toString(),
    rating: reviews.rating,
  }));
  const csvDataRes = csvjson.toCSV(restaurantArray, {
    headers: "key",
  });
  // Thay đổi header
  const customHeaders = "resInfor,resName";
  const csvDataResWithCustomHeader = `${customHeaders}\n${csvDataRes.split("\n").slice(1).join("\n")}`;
  const csvDataReview = csvjson.toCSV(reviewArray, {
    headers: "key",
  });
  fs.writeFileSync("res.csv", csvDataResWithCustomHeader, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  fs.writeFileSync("review.csv", csvDataReview, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  res.status(200).send({
    status: "success",
  });
};
