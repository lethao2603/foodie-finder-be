const mongoose = require('mongoose');

const Restaurant = require('../models/restaurant.model');

const reviewSchema = new mongoose.Schema({
    rating: {type: Number, min: 1, max: 5},
    comment: {type: String, require: true},
    cusInfor: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},//require: true 
    resInfor: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", require: true },
    },
    {timestamps: true }, // createAt, updateAt
);

reviewSchema.index({ resInfor: 1, cusInfor: 1}, {unique: true});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'cusInfor',
        select: 'firstName lastName'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(resId) {
    const stats = await this.aggregate([
        {
            $match: {resInfor: resId}
        },
        {
            $group: {
                _id: '$resInfor',
                //numberRating: {$sum: 1},
                avgRating: {$avg: '$rating'} 
            }
        }
    ]);
    if(stats.length > 0) {
        await Restaurant.findByIdAndUpdate(resId, {
            pointEvaluation: stats[0].avgRating
        });
    } else {
        await Restaurant.findByIdAndUpdate(resId, {
            pointEvaluation: 4.5
        });
    }
};

reviewSchema.post('save', function() {
    // this points to current review
    this.constructor.calcAverageRatings(this.resInfor)
});

//Change average rating when updating
//Change average rating when deleting
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRatings(this.r.resInfor);
})

const Review = mongoose.model('review', reviewSchema); 

module.exports = Review;