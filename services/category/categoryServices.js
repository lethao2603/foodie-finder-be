const Category = require("../../models/category.model");
const APIFeatures = require("../../utils/apiFeatures");

exports.createCategory = async (data) => {
    let result = await Category.create(data);
    return result;
};

exports.getCategory = async (queryString) => {
    //EXECUTE QUERY
    const features = new APIFeatures(Category.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const result = await features.query;
    return result;
};

exports.getCategoryById = async (id) => {
    let result = await Category.findById(id);
    return result;
};

exports.updateCategory = async (id, data) => {
    let result = await Category.updateOne({ _id: id }, { $set: data });
    return result;
};

exports.deleteCategory = async (id) => {
    let result = await Category.deleteById(id);
    return result;
};