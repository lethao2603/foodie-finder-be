const useServices = require("../../services/user/userServices");

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