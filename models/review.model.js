const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {type: Number, min: 1, max: 5},
    comment: {type: String, require: true},
    userInfor: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},//require: true 
    resInfor: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", require: true },
    },
    {timestamps: true } // createAt, updateAt
)

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'resInfor',
        select: 'resname'
    });
    // this.populate({
    //     path: 'userInfor',
    //     select: 'firstName lastName'
    // });
    next();
});

const Review = mongoose.model('review', reviewSchema); 

module.exports = Review;