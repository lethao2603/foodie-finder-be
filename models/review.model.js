const mongoose = require("mongoose");

const mongoose_delete = require("mongoose-delete");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 1 && value <= 5;
        },
        message: "Rating must be between 1 and 5",
      },
    },
    comment: { type: String, default: "" },
    resInfor: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", default: "Undefined" },
    cusInfor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: "Undefined" },
  },
  { timestamps: true } // createAt, updateAt
);

reviewSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
