const Restaurant = require("../../models/restaurant.model");
const Category = require("../../models/category.model");
const Tag = require("../../models/tag.model");
const APIFeatures = require("../../utils/apiFeatures");
const {updateTagsOfRestaurant} = require("../../controllers/test.controller")
exports.createRestaurant = async (data) => {
  try {
    let result = await Restaurant.create(data);
    const resId = result._id;
    await updateTagsOfRestaurant({_id: resId})
    return result;
  } catch (err) {
    next(err);
  }
};

exports.getRestaurant = async (queryString) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Restaurant.find(), queryString);
  const _ = await features.getMetadata();
  features.search().filter().sort().limitFields().paginate();
  const result = await features.query;
  return { result, ...features.metadata, pageSize: result.length };
};

exports.getRestaurantById = async (id) => {
  let result = await Restaurant.findById(id).populate("reviews").populate({
    path: "resMenuInfor resOwnerInfor resCateInfor",
    select: "-__v -createdAt -updatedAt -numericId -numericId1",
  });

  return result;
};

exports.updateRestaurant = async (id, data) => {
  let result = await Restaurant.updateOne({ _id: id }, { $set: data });
  return result;
};

exports.deleteRestaurant = async (id) => {
  let result = await Restaurant.deleteById(id);
  
  return result;
};

exports.searchRestaurant = async (queryString) => {
  const features = new APIFeatures(Restaurant.find(), queryString).search().paginate();
  const result = await features.query;
  return result;
};

exports.getResByCatgory = async (cateName) => {
  const category = await Category.findOne({ categoryName: cateName });
  if (category) {
    result = await Restaurant.find({ resCateInfor: category._id });
  } else {
    result = [];
  }
  return result;
};

exports.aliasTopRes = (req, res) => {
  req.query.limit = "5";
  req.query.sort = "-pointEvaluation,averagePrice";
  req.query.fields = "resname,address,timeOpen,timeClose,seats,typeOfRes";
};

exports.calculateRestaurantStats = async (req, res) => {
  const stats = await Restaurant.aggregate([
    {
      $match: { averagePrice: { $gte: 100000 } },
    },
    {
      $group: {
        _id: { $toUpper: "$typeOfRes" },
        numTours: { $sum: 1 },
        avgRating: { $avg: "$pointEvaluation" },
        avgPrice: { $avg: "$averagePrice" },
        minPrice: { $min: "$averagePrice" },
        maxPrice: { $max: "$averagePrice" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {_id: { $ne: 'BEEFSTEAK'}}
    // }
  ]);
  return stats;
};
