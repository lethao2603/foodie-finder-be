const restaurant = require("../../models/menu.model");

module.exports = {
  createMenu: async (data) => {
    let result = await restaurant.create(data);
    return result;
  },
};
