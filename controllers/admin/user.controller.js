const useServices = require("../../services/user/userServices");
const AppError = require("../../utils/appError.util")
const User = require("../../models/user.model");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if(allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return  newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = async (req, res) => {
    //Create error if user POSTs passowrd data
    if(req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password updates. Please use/updateMyPassword.',
            400)
        )
    }

    //Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body,'firstName','lastName','phone','email');
    //Update user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'succes',
        data: {
            user: updateUser
        }
    })
};

exports.deleteMe = async (req, res) => {
    await User.deleteById(req.user.id);
    
    res.status(204).json({
        status: 'success',
        data: null
    })
};

exports.getAllUsers = async (req, res) => {
  try {
    let result = await useServices.getUser(req.query);
    return res.status(200).json(
        {
            status: 'success',
            results: result.length,
            data: result
        });
} catch (error) {
    res.status(404).json({
        status: 'fail',
        message: error
    });
}
};

exports.postcreateUser = async (req, res) => {
  try {
    let result = await useServices.createUser(req.body);
    return res.status(201).json(
        {
            status: 'success',
            data: result
        });
  } catch (error) {
    res.status(400).json({
        status: 'fail',
        message: error
    }); 
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await useServices.getUserId(id);
    return res.status(200).json(
        {
            status: 'success',
            data: result
        });
} catch (error) {
    res.status(404).json({
        status: 'fail',
        message: error
    });
}
};

exports.patchUpdateUser = async (req, res) => {
  try {
        const id = req.params.id;
        const updatedData = req.body;
    let result = await useServices.updateUser(id, updatedData);
    return res.status(200).json(
        {
            status: 'success',
            data: result
        })
  } catch (error) {
    res.status(404).json({
        status: 'fail',
        message: error
    });
  }
};

exports.deleteUser = async (req, res) => {
    try {
        await useServices.delUser(req.params.id);
        return res.status(204).json(
            {
                status: 'success',
                data: null
            });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};