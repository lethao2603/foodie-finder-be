const multer = require("multer");
const sharp = require("sharp");
const useServices = require("../../services/restaurant/restaurantServices");
const Restaurant = require("../../models/restaurant.model");
const { extractUserIdFromToken } = require("../../utils/auth.util");
const { updateSearchHistory } = require("../../controllers/recommendation/index.controller");
const multerStorage = multer.memoryStorage();
const mongoose = require("mongoose");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadResImages = upload.fields([
  //{name: 'imageCover', maxCount: 1},
  { name: "image", maxCount: 1 },
]);

exports.resizeResImages = async (req, res, next) => {
  if (!req.files.image) return next();
  //Image
  req.body.image = `res-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/restaurants/${req.body.image}`);

  //Images
  // req.body.images = [];

  // req.files.images.foreach(async (file, i) => {
  //     const filename = `res-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

  //     await sharp(files.buffer)
  //         .resize(2000, 1333)
  //         .toFormat('jpeg')
  //         .jpeg({quality: 90})
  //         .toFile(`public/images/restaurants/${filename}`);

  //     req.body.images.push(filename);
  // });
  next();
};

exports.postCreateRestaurant = async (req, res) => {
  try {
    if (!req.body.resOwner) req.body.resOwnerInfor = req.user.id;
    let result = await useServices.createRestaurant(req.body);
    return res.status(201).json({
      status: "success",
      data: result,
    });
    // triển khai logic thông báo cho admin tại đây
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getPendingRestaurants = async (req, res) => {
  try {
    const result = await Restaurant.find({ status: "pending" });
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.respondToRestaurantRequest = async (req, res) => {
  try {
    const { restaurantId, action } = req.body;
    const validActions = ["accept", "reject"];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    if (action === "accept") {
      restaurant.status = "accepted";
    } else {
      restaurant.status = "rejected";
    }

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.aliasTopRestaurants = async (req, res, next) => {
  useServices.aliasTopRes(req, res);
  next();
};

exports.getAllRestaurant = async (req, res) => {
  try {
    let result = await useServices.getRestaurant(req.query);
    return res.status(200).json({
      status: "success",
      results: result.length,
      total_page: Math.ceil(result.length / result.limit),
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await useServices.getRestaurantById(id);
    let userId = extractUserIdFromToken(req.headers?.authorization);
    if (userId) {
      await updateSearchHistory(userId, id);
    }
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.patchUpdateRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    let result = await useServices.updateRestaurant(id, updatedData);
    return res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
exports.deleteDelRestaurant = async (req, res) => {
  try {
    console.log(req.params.id);
    await useServices.deleteRestaurant(req.params.id);
    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getsearchRestaurant = async (req, res) => {
  try {
    let result = await useServices.searchRestaurant(req.query);
    return res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getRestaurantByCategory = async (req, res) => {
  try {
    const cateName = req.params.cateName;
    let result = await useServices.getResByCatgory(cateName);
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await useServices.calculateRestaurantStats(req, res);
    return res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getAllRestaurants = async (req, res, next) => {
  console.log("a");
  try {
    const ids = req.body.ids;
    const objIds = ids.map((id) => mongoose.Types.ObjectId(id));

    const restaurants = await Restaurant.find({ _id: { $in: objIds } });
    return res.status(200).json({
      status: "success",
      data: restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
