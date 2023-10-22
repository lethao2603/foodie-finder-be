const Restaurant = require("../../models/restaurant.model");

const aqp = require("api-query-params");

module.exports = {
  createRestaurant: async (data) => {
    if (data.type === "EMPTY-RESTAURANT") {
      let result = await Restaurant.create(data);
      return result;
    }
    if (data.type === "ADD-MENU") {
      let menuRestaurant = await Restaurant.findById(data.restaurantId).exec();

      for (let i = 0; i < data.menuArr.length; i++) {
        menuRestaurant.resMenuInfor.push(data.menuArr[i]);
      }

      let newResult = await menuRestaurant.save();

      return newResult;
    }
    if (data.type === "REMOVE-MENU") {
      let menuRestaurant = await Restaurant.findById(data.restaurantId).exec();
      for (let i = 0; i < data.menuArr.length; i++) {
        menuRestaurant.resMenuInfor.pull(data.menuArr[i]);
      }
      let newResult = await menuRestaurant.save();

      return newResult;
    }
  },
  getRestaurant: async (queryString) => {
    const page = queryString.page;
    const population = queryString.populate;
    const { filter, limit } = aqp(queryString);
    let offset = (page - 1) * limit;
    delete filter.page;
    result = await Restaurant.find(filter).populate(population).skip(offset).limit(limit).exec();
    return result;
  },
  getRestaurantById: async (id) => {
    let result = await Restaurant.findById(id).exec();
  },

  updateRestaurant: async (data) => {
    let result = await Restaurant.updateOne({ _id: data.id }, { ...data });
    return result;
  },
  deleteRestaurant: async (id) => {
    let result = await Restaurant.deleteById(id);
    return result;
  },
  searchRestaurant: async (queryString) => {
    const page = queryString.page;
    const search = queryString.search;
    const { filter, limit } = aqp(queryString);
    let offset = (page - 1) * limit;
    delete filter.page;

    let result = await Restaurant.find({
      $or: [
        { resname: { $regex: search, $options: "i" } }, 
        { typeOfRes: { $regex: search, $options: "i" } },
        { "address.street": { $regex: search, $options: "i" } },
        { "address.district": { $regex: search, $options: "i" } },
        { "address.province": { $regex: search, $options: "i" } }
      ]
    }).skip(offset)
      .limit(limit)
      .exec();

    return result;
  },
};
