const useServices = require("../../services/restaurant/restaurantServices")

//const fileServices = require("../../services/file.services");
const { use } = require("../../routes/apis");

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
    },
    getAllRestaurant: async (req, res) => {
        let result = await useServices.getRestaurant(req.query);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    putUpdateRestaurant: async (req, res) => {
        let result = await useServices.updateRestaurant(req.body);
        // if (!req.files || Object.keys(req.files).length === 0) {
        //     //do nothing
        // }
        // else {
        //     let result = await uploadSingleFile(req.files.image);
        //     imageUrl = result.path;
        // }
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteDelRestaurant: async (req, res) => {
        let result = await useServices.deleteRestaurant(req.body.id);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        ) 
    },
    getsearchRestaurant: async (req, res) => {
        let result = await useServices.searchRestaurant(req.query);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        ) 
    }
}
