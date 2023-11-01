const User = require("./../../models/user.model");
const AppError = require("../../utils/appError.util").default;

exports.getAllUsers = async (req, res) => {};
 res.status(500).json({
  status: 'error',
  message: 'This route is not yet defined!'
 });
exports.getUserById = async (req, res) => {};
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).send({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res) => {};
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
exports.editUser = async (req, res) => {};
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });