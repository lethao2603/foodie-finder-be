const User = require("../../models/user.model");
const APIFeatures = require("../../utils/apiFeatures");

exports.createUser = async (data) => {
    let result = await User.create(data);
    return result;
};

exports.getUser = async (queryString) => {
    //EXECUTE QUERY
    let features = new APIFeatures(User.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let result = await features.query;
    return result;
};

exports.getUserId = async (id,) => {
    let result = await User.findById(id);
    return result;
};

exports.updateUser = async (id, data) => {
    let result = await User.updateOne({ _id: id }, { $set: data });
    return result;
};

exports.delUser = async (id) => {
    let result = await User.deleteById(id);
    return result;
};
