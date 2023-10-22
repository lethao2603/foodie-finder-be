const useServices = require("../../services/category/categoryServices")

module.exports = {
    postCreateCategory: async (req, res) => {
        let result = await useServices.createCategory(req.body);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    }
}