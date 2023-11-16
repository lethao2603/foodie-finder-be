const useServices = require("../../services/category/categoryServices")

exports.postCreateCategory = async (req, res) => {
    try {
        let result = await useServices.createCategory(req.body);
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

exports.getAllCategory = async (req, res) => {
    try {
        let result = await useServices.getCategory(req.query);
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

exports.getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        let result = await useServices.getCategoryById(id);
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

exports.patchUpdateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        let result = await useServices.updateCategory(id, updatedData);
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
exports.deleteDelCategory = async (req, res) => {
    try {
        await useServices.deleteCategory(req.params.id);
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