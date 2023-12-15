const mongoose = require("mongoose");
const User = require("./user.model");
const mongoose_delete = require("mongoose-delete");

const personalConfigSchema = new mongoose.Schema(
  {
    preferences: {
      values: [
        {
          type: String,
        },
      ],
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    searchHistory: {
      values: [
        {
          restaurantId: String,
          time: Date,
        },
      ],
      enabled: {
        type: Boolean,
        default: false,
      },
      maxItems: {
        type: Number,
        default: 3,
      },
    },
    CFRecommendation: {
      type: Map,
    },
    firstTimeLogin: {
      type: Boolean,
      default: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true } // createAt, updateAt
);

personalConfigSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const PersonalConfig = mongoose.model("personal_config", personalConfigSchema);

module.exports = PersonalConfig;
