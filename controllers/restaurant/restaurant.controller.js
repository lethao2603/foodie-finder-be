const Restaurant = require("../../models/restaurant.model");
const useServices = require("../../services/restaurant/restaurantServices")

module.exports = {
    postCreateRestaurant: async (req,res) => {
        try{
            let result = await useServices.createRestaurant(req.body);
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
    },
    aliasTopRestaurant: (req, res, next) => {
        useServices.aliasTopRes(req, res);
        next();
    },
    getAllRestaurant: async (req, res) => {
        try {
            let result = await useServices.getRestaurant(req.query);
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
    },
    getRestaurantById: async (req, res) => {
        try {
            const id = req.params.id;
            let result = await useServices.getRestaurantById(id);
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
    },
    putUpdateRestaurant: async (req, res) => {
        try {
            let result = await useServices.updateRestaurant(req.body);
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
    },
    deleteDelRestaurant: async (req, res) => {
        try {
            await useServices.deleteRestaurant(req.body.id);
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
    },
    getsearchRestaurant: async (req, res) => {
        try {
            let result = await useServices.searchRestaurant(req.query);
            return res.status(200).json(
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
    },
    getRestaurantByCategory: async (req, res) => {
        try {
            const cateName = req.params.cateName;
            let result = await useServices.getResByCatgory(cateName);
            return res.status(200).json(
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
    },
    getTourStats: async (req, res) => {
        try {
            const stats = Restaurant.aggregate([
                {
                    $match: { pointEvaluation: { $gte: 4.5 }}
                },
                {
                    $group: {
                        _id: null,
                        avgRating: { $avg: '$pointEvaluation'},
                        avgPrice: { $avg: '$averagePrice'},
                        minPrice: { $min: '$averagePrice'},
                        maxPrice: { $max: '$averagePrice'},
                    }
                }
            ]);
            return res.status(200).json(
                {
                    status: 'success',
                    data: stats
                });
        } catch (error) {
            res.status(404).json({
                status: 'fail',
                message: error
            });
        }
    }
}
