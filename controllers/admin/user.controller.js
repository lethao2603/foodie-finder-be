const User = require("./../../models/user.model");

exports.getAllUsers = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.getUserById = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(
      {
          status: 'success',
          data: newUser
      });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
  });
  }
};

exports.deleteUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.editUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};