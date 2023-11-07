const Review = require("../../models/review.model");

exports.createReview = async (data) => {
        let result = await Review.create(data);
        return result;
};

exports.getReview = async (queryString) => {
        result = await Review.find(queryString);
        return result;
};

exports.updateReview = async (data) => {
        let result = await Review.updateOne({ _id: data.id }, { ...data });
        return result;
};

exports.deleteReview = async (id) => {
        let result = await Review.deleteById(id);
        return result;
}
