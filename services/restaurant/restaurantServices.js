const restaurant = require("../../models/restaurant.model");

module.exports = {
    createRestaurant: async (data) => {
        if (data.type === "EMPTY-RESTAURANT") {
        let result = await restaurant.create(data);
        return result;
        }
    }
}