const multer = require('multer');
const sharp = require('sharp');

const useServices = require("../../services/user/userServices");
const AppError = require("../../utils/appError.util")
const User = require("../../models/user.model");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = async (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/users/${req.file.filename}`);
    next();
}

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
    if(req.file) {
        filteredBody.photo = req.file.filename;
    }
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
            total_page: Math.ceil(result.length / 10),
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
                data: null
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