const useServices = require("../../services/review/reviewServices")

exports.postCreateReview = async (req, res) => {
    try {
        let result = await useServices.createReview(req.body);
        return res.status(201).json(
            {
                status: 'success',
                data: result
            }
        )       
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.getAllReview = async (req, res) => {
    try {
        let result = await useServices.getReview(req.query);
        return res.status(200).json(
            {
                status: 'success',
                results: result.length,
                data: result
            }
        )
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.putUpdateReview = async (req, res) => {
        let result = await useServices.updateReview(req.body);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
};

exports.deleteReview = async (req, res) => {
        let result = await useServices.deleteReview(req.body.id);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        ) 
};