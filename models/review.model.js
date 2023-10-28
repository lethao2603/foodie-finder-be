const mongoose = require('mongoose');

const mongoose_delete = require('mongoose-delete');

const reviewSchema = new mongoose.Schema({
    rating: {type: Number, require: true},
    comment: {type: String, require: true},
    //cusInfor: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, 
    resInfor: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", default: "Undefined" },
    },
    {timestamps: true } // createAt, updateAt
)

reviewSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Review = mongoose.model('review', reviewSchema); 

module.exports = Review;