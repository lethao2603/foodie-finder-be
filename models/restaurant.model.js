const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const restaurantSchema = new mongoose.Schema({
    resname: { 
      type: String, 
      required: [true, 'A restaurant must have a name'], 
      unique: true, 
      trim: true},
    address: {
      street: { type: String, required: [true, 'Street must not be empty'], trim: true},
      district: { type: String, required: [true, 'District must not be empty'], trim: true},
      city: { type: String, required: [true, 'City must not be empty'], trim: true},
    },
    timeOpen: { type: String, required: [true, 'timeOpen must not be empty']},
    timeClose: { type: String, required: [true, 'timeClose must not be empty']},
    seats: { type: Number, required: [true, 'seats must not be empty']},
    typeOfRes: {
      type: String, 
      required: [true, 'typeOfRes must not be empty']},
    averagePrice: { type: Number, required: [true, 'averagePrice must not be empty']},
    pointEvaluation: {type: Number,default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']},
    description: { type: String, trim: true},
    image: {type: String, required: [true, 'image must not be empty']},
    resMenuInfor: { type: mongoose.Schema.Types.ObjectId, ref: "menu", default: "Undefined" },
    resCateInfor: {type: mongoose.Schema.Types.ObjectId, ref: 'category',default: "Undefined" },
    //resOwnerInfor: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  },
  { timestamps: true } // createAt, updateAt
);
restaurantSchema.path('createdAt').select(false);
restaurantSchema.path('updatedAt').select(false);
restaurantSchema.plugin(mongoose_delete, { overrideMethods: "all" });

// Chưa hiển thị được trường ảo: reviews
//Virtual populate
restaurantSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'resInfor',
  localField: '_id'
});

const Restaurant = mongoose.model("restaurant", restaurantSchema);

module.exports = Restaurant;
