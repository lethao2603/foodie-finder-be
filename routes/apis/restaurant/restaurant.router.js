const express = require("express");
const routeAPI = express.Router();
const RestaurantController = require("../../../controllers/restaurant/restaurant.controller");
const reviewRouter = require("../review/review.router");
const authController = require("../../../controllers/auth.controller");

// POST /restaurant/d343dsds/review
// GET /restaurant/d343dsds/review

routeAPI.use("/:resId/review", reviewRouter);

routeAPI.get("/res-stats", RestaurantController.getTourStats); 
routeAPI.get("/top-5-cheap",RestaurantController.aliasTopRestaurants,
    RestaurantController.getAllRestaurant);
routeAPI.get("/search", RestaurantController.getsearchRestaurant);

routeAPI.get("/", RestaurantController.getAllRestaurant);
routeAPI.post("/create",
    authController.protect, 
    authController.restrictTo('admin', 'restaurant-owner'), 
    RestaurantController.postCreateRestaurant
);
routeAPI.get("/:id", RestaurantController.getRestaurantById);
routeAPI.patch("/:id",
    authController.protect, 
    authController.restrictTo('admin', 'restaurant-owner'),  
    RestaurantController.patchUpdateRestaurant);
routeAPI.delete("/:id",
    authController.protect, 
    authController.restrictTo('admin', 'restaurant-owner'), 
    RestaurantController.deleteDelRestaurant);  

routeAPI.get("/category/:cateName", RestaurantController.getRestaurantByCategory);

module.exports = routeAPI;
