const useServices = require("../../services/review/reviewServices")

module.exports = {
    postCreateReview: async (req, res) => {
        let result = await useServices.createReview(req.body);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    getAllReview: async (req, res) => {
        let result = await useServices.getReview(req.query);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    putUpdateReview: async (req, res) => {
        let result = await useServices.updateReview(req.body);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteReview: async (req, res) => {
        let result = await useServices.deleteReview(req.body.id);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        ) 
    }
}