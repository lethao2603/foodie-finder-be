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
          type: String,
        },
      ],
      enabled: {
        type: Boolean,
        default: false,
      },
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true } // createAt, updateAt
);

categorySchema.plugin(mongoose_delete, { overrideMethods: "all" });

const PersonalConfig = mongoose.model("personalConfig", personalConfigSchema);

module.exports = PersonalConfig;
