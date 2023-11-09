const useServices = require("../../services/restaurant/restaurantServices");

exports.postCreateRestaurant = async (req, res) => {
    try {
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
};

exports.aliasTopRestaurants = async (req, res, next) => {
    useServices.aliasTopRes(req, res);
    next();
};

exports.getAllRestaurant = async (req, res) => {
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
};

exports.getRestaurantById = async (req, res) => {
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
};

exports.patchUpdateRestaurant = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        let result = await useServices.updateRestaurant(id, updatedData);
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
exports.deleteDelRestaurant = async (req, res) => {
    try {
        await useServices.deleteRestaurant(req.params.id);
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
    exports.getsearchRestaurant = async (req, res) => {
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
exports.getRestaurantByCategory = async (req, res) => {
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
};
exports.getTourStats = async (req, res) => {
    try {
        const stats = await useServices.calculateRestaurantStats(req, res);
        return res.status(200).json({
            status: 'success',
            data: stats,
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        });
    }
};


