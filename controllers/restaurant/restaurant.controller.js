const useServices = require("../../services/restaurant/restaurantServices")

//const useValidation = require('../../validations/restaurantValidation');
//const fileServices = require("../../services/file.services");

module.exports = {
    postCreateRestaurant: async (req,res) => {
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
    getRestaurantById: async (req, res) => {
        const id = req.params.id;
        let result = await useServices.getRestaurantById(id);
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
    },
    getRestaurantByCategory: async (req, res) => {
        const cateName = req.params.cateName;
        let result = await useServices.getResByCatgory(cateName);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    }

}
