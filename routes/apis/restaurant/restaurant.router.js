const express = require('express');

const routeAPI = express.Router();

const RestaurantController = require("../../../controllers/restaurant/restaurant.controller")


//routeAPI.get('/', RestaurantController.getRestaurant);
routeAPI.post('/create', RestaurantController.postCreateRestaurant);
//routeAPI.put('/update', RestaurantController.putUpdateRestaurant);
//routeAPI.put('/delete', RestaurantController.deleteRestaurant);

module.exports = routeAPI;