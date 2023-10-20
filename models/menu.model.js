const mongoose = require("mongoose");

const mongoose_delete = require("mongoose-delete");
//shape data
const menuSchema = new mongoose.Schema(
  {
    deleted: {
      type: "boolean",
      default: false,
    },
    items: [
      {
        name: String,
        photo: String,
        price: String,
      },
    ],
  },
  { timestamps: true } // createAt, updateAt
);

menuSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Menu = mongoose.model("menu", menuSchema);

module.exports = Menu;
