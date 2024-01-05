const Booking = require("../../models/booking.model");
const APIFeatures = require("../../utils/apiFeatures");
const socketIO = require("../../libs/socket.lib");
const Restaurant = require("../../models/restaurant.model");
const ObjectId = require("mongodb").ObjectId;

exports.createBooking = async (data) => {
  let result = await Booking.create(data);
  // Thông báo cho chủ nhà hàng với Socket.IO
  socketIO.sendOrderNotification(result);
  return result;
};

exports.bookingById = async (id) => {
  let result = await Booking.findById(id);
  return result;
};

exports.allBooking = async (filter) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Booking.find(), filter).search().filter().sort().limitFields().paginate();
  let result = await features.query;
  result = await Booking.aggregate([
    {
      $lookup: {
        from: Restaurant.collection.name,
        localField: "resInfor",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant",
    },
    {
      $addFields: {
        restaurantId: "$restaurant._id",
        restaurantName: "$restaurant.resname",
        restaurantImage: "$restaurant.image",
      },
    },
    {
      $project: {
        restaurant: 0,
      },
    },
  ]).exec();
  return result;
};

exports.allBookingsByCustomer = async (customerId, filter) => {
  //EXECUTE QUERY
  const result = await Booking.aggregate([
    { $match: { cusInfor: ObjectId(customerId) } },
    {
      $lookup: {
        from: Restaurant.collection.name,
        localField: "resInfor",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    { $sort: { updatedAt: -1 } },
    {
      $unwind: "$restaurant",
    },
    {
      $addFields: {
        restaurantId: "$restaurant._id",
        restaurantName: "$restaurant.resname",
        restaurantImage: "$restaurant.image",
        restaurantAddress: "$restaurant.address",
      },
    },
    {
      $project: {
        restaurant: 0,
      },
    },
  ]).exec();
  return result;
};

exports.updateBooking = async (id, data) => {
  let result = await Booking.updateOne({ _id: id }, { $set: data });
  return result;
};

exports.deleteBooking = async (id) => {
  let result = await Booking.deleteById(id);
  return result;
};
