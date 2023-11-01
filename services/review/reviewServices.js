const { response } = require("express");
const Review = require("../../models/review.model");

const aqp = require("api-query-params");

module.exports = {
    createReview: async (data) => {
        let result = await Review.create(data);
        return result;
    },
    getReview: async (queryString) => {
        // const page = queryString.page;
        // const { filter, limit } = aqp(queryString);
        // let offset = (page - 1) * limit;
        // delete filter.page;
        result = await Review.find(queryString);//.populate('resInfor').skip(offset).limit(limit).exec();
        return result;
    },
    updateReview: async (data) => {
        let result = await Review.updateOne({ _id: data.id }, { ...data });
        return result;
    },
    deleteReview: async (id) => {
        let result = await Review.deleteById(id);
        return result;
    }
};
