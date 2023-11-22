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
