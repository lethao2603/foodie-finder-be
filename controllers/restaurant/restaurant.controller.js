const useServices = require("../../services/restaurant/restaurantServices")

const fileServices = require("../../services/file.services");

module.exports = {
    postCreateRestaurant: async (req,res) => {
        // let image = "";
       
        // // image: String,
        // if (!req.files || Object.keys(req.files).length === 0) {
        //     //do nothing
        // }
        // else {
        //     let result = await fileServices.uploadSingleFile(req.files.image);
        //     image = result.path;
        // }

        let result = await useServices.createRestaurant(req.body);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    }
}
