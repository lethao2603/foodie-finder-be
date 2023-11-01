const express = require("express");
const routeAPI = express.Router();
const RestaurantController = require("../../../controllers/restaurant/restaurant.controller");
const reviewController = require('../../../controllers/review/review.controller');
const authController = require('../../../controllers/auth.controller');

routeAPI.get("/", RestaurantController.getAllRestaurant);
routeAPI.get("/search", RestaurantController.getsearchRestaurant);
routeAPI.get("/:id", RestaurantController.getRestaurantById);
routeAPI.post("/create", RestaurantController.postCreateRestaurant);
routeAPI.put("/update", RestaurantController.putUpdateRestaurant);
routeAPI.delete("/delete", RestaurantController.deleteDelRestaurant);
routeAPI.get("/category/:cateName", RestaurantController.getRestaurantByCategory);
//routeAPI.get("/top-5-cheap",RestaurantController.aliasTopRestaurant, RestaurantController.getAllRestaurant);
routeAPI.get("/res-stats", RestaurantController.getTourStats); 

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
