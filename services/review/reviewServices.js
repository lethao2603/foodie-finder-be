const Review = require("../../models/review.model");

exports.createReview = async (data) => {
        let result = await Review.create(data);
        return result;
};

exports.getReview = async (filter) => {
        result = await Review.find(filter);
        return result;
};

exports.updateReview = async (data) => {
        let result = await User.updateOne({ _id: id }, { $set: data });
        return result;
};

exports.delReview = async (id) => {
        let result = await Review.deleteById(id);
        return result;
}
