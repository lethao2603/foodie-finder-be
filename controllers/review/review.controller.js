const useServices = require("../../services/review/reviewServices")

exports.postCreateReview = async (req, res) => {
    try {
        //Allow nested routes
        if(!req.body.restaurant) req.body.resInfor = req.params.resId;
        if(!req.body.customer) req.body.cusInfor = req.user.id;

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
        let filter = {};
        if(req.params.resId) 
            filter = { resInfor: req.params.resId};

        let result = await useServices.getReview(filter);
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

exports.patchUpdateReview = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        let result = await useServices.updateReview(id, updatedData);
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

exports.deleteReview = async (req, res) => {
    try {
        await useServices.delReview(req.params.id);
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