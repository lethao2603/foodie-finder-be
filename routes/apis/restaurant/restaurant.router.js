const express = require("express");
const routeAPI = express.Router();
const RestaurantController = require("../../../controllers/restaurant/restaurant.controller");
const reviewController = require('../../../controllers/review/review.controller');
const authController = require('../../../controllers/auth.controller');

routeAPI.get("/",//authController.protect,
    RestaurantController.getAllRestaurant);
routeAPI.post("/create", RestaurantController.postCreateRestaurant);

routeAPI.get("/search", RestaurantController.getsearchRestaurant);

routeAPI.get("/res-stats", RestaurantController.getTourStats); 
routeAPI.get("/top-5-cheap",RestaurantController.aliasTopRestaurants,
    RestaurantController.getAllRestaurant);

routeAPI.post("/create", RestaurantController.postCreateRestaurant);
routeAPI.put("/update", RestaurantController.putUpdateRestaurant);
routeAPI.get("/category/:cateName", RestaurantController.getRestaurantByCategory);
routeAPI.delete("/:id",
    authController.protect, 
    authController.restrictTo('admin'), 
    RestaurantController.deleteDelRestaurant);  
routeAPI.get("/:id", RestaurantController.getRestaurantById);

// RestaurantController.getAllRestaurant);

// POST /restaurant/d343dsds/review
// GET /restaurant/d343dsds/review
// GET /restaurant/d343dsds/review/ds3232d
// routeAPI.route('/:restaurantID/review')
// .post(
//     authController.protect,
//     authController.restrictTo('users'),
//     reviewController.createReview
// );

module.exports = routeAPI;
