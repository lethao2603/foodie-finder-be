const category = require("../../models/category.model");

module.exports = {
    createCategory: async (data) => {
        let result = await category.create(data);
        return result;
    }
}