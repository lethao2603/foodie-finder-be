const Review = require("../../models/review.model");
const Booking = require("../../models/booking.model");

exports.createReview = async (data) => {
  let result = await Review.create(data);
  return result;
};

exports.getReview = async (filter) => {
  result = await Review.find({ ...filter, deleted: false }).sort({ updatedAt: -1 });
  return result;
};

exports.updateReview = async (id, data) => {
  let result = await User.updateOne({ _id: id }, { $set: data });
  return result;
};

exports.delReview = async (id) => {
  let result = await Review.deleteById(id);
  return result;
};

exports.getUserBooking = async (customerId, restaurantId) => {
  try {
    const userBooking = await Booking.findOne({ cusInfor: customerId, resInfor: restaurantId });
    return userBooking;
  } catch (error) {
    throw new Error("Error getting user order");
  }
};

exports.getMyReview = async (customerId) => {
  try {
    const reviews = await Review.find({ cusInfor: customerId, deleted: false }).sort({ updatedAt: -1 });
    return reviews;
  } catch (error) {
    throw error;
  }
};
