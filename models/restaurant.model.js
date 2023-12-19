const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const Tag = require("./tag.model");
const { DateTime } = require("mssql");
const { AutoIncrement } = require("../config/db");
const restaurantSchema = new mongoose.Schema(
  {
    resname: {
      type: String,
      required: [true, "A restaurant must have a name"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    address: {
      street: { type: String, required: [true, "Street must not be empty"], trim: true },
      district: { type: String, required: [true, "District must not be empty"], trim: true },
      city: { type: String, required: [true, "City must not be empty"], trim: true },
    },
<<<<<<< HEAD
    timeOpen: { type: String, required: [true, 'timeOpen must not be empty']},
    timeClose: { type: String, required: [true, 'timeClose must not be empty']},
    seats: { type: Number, required: [true, 'seats must not be empty'],
      min: [10, 'Seats must be greater than or equal to 10'],
      max: [100, 'Seats must be less than or equal to 100'],},
=======
    timeOpen: { type: String, required: [true, "timeOpen must not be empty"] },
    timeClose: { type: String, required: [true, "timeClose must not be empty"] },
    seats: { type: Number, required: [true, "seats must not be empty"] },
>>>>>>> 7185221ab6b327587a0311813bc54e38c937da32
    typeOfRes: {
      type: String,
      required: [true, "typeOfRes must not be empty"],
    },
<<<<<<< HEAD
    status: { type: String, default: 'pending' }, // 'pending', 'accepted', 'rejected'
    description: { type: String, trim: true},
    image: {type: String, required: [true, 'image must not be empty']},
    resMenuInfor: { type: mongoose.Schema.Types.ObjectId, ref: "menu"},
    resCateInfor: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    resOwnerInfor: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
=======
    averagePrice: { type: Number, required: [true, "averagePrice must not be empty"] },
    pointEvaluation: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.6666 -> 4.7
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag",
      },
    ],
    description: { type: String, trim: true },
    image: { type: String, required: [true, "image must not be empty"] },
    resMenuInfor: { type: mongoose.Schema.Types.ObjectId, ref: "menu", default: "Undefined" },
    resCateInfor: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    resOwnerInfor: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
>>>>>>> 7185221ab6b327587a0311813bc54e38c937da32

    // reservations: [{type: mongoose.Schema.Types.ObjectId, ref: 'reservations'}],
    numericId1: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true } // createAt, updateAt
);
restaurantSchema.path("createdAt").select(false);
restaurantSchema.path("updatedAt").select(false);
restaurantSchema.plugin(mongoose_delete, { overrideMethods: "all" });
restaurantSchema.index({
  resname: "text",
  typeOfRes: "text",
  "address.street": "text",
  "address.district": "text",
  "address.province": "text",
  categoryName: "text",
});

//Virtual populate
restaurantSchema.virtual("reviews", {
  ref: "review",
  foreignField: "resInfor",
  localField: "_id",
});

restaurantSchema.pre(/^find/, function (next) {
  this.populate({
    path: "resCateInfor",
    select: "categoryName",
  });
  next();
});

restaurantSchema.plugin(AutoIncrement, { inc_field: "numericId1", start_seq: 504 });

const Restaurant = mongoose.model("restaurant", restaurantSchema);
module.exports = Restaurant;
