const mongoose = require("mongoose");

const mongoose_delete = require("mongoose-delete");
//shape data
const globalConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rcmDataframeVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true } // createAt, updateAt
);

globalConfigSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const GlobalConfig = mongoose.model("global_config", globalConfigSchema);

module.exports = GlobalConfig;
