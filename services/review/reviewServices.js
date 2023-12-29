const Review = require("../../models/review.model");
const Booking = require('../../models/booking.model');

exports.createReview = async (data) => {
        let result = await Review.create(data);
        return result;
};

exports.getReview = async (filter) => {
        result = await Review.find(filter);
        return result;
};

exports.updateReview = async (id, data) => {
        let result = await User.updateOne({ _id: id }, { $set: data });
        return result;
};

exports.delReview = async (id) => {
        let result = await Review.deleteById(id);
        return result;
}

exports.getUserBooking = async (customerId, restaurantId) => {
        try {
            const userBooking = await Booking.findOne({ cusInfor: customerId, resInfor: restaurantId });  
            return userBooking;
        } catch (error) {
            throw new Error('Error getting user order');
        }
};