const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
//shape data
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true } // createAt, updateAt
);

tagSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Tag = mongoose.model("tag", tagSchema);

module.exports = Tag;
