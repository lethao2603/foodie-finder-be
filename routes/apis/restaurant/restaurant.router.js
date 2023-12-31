const express = require("express");
const routeAPI = express.Router();
const RestaurantController = require("../../../controllers/restaurant/restaurant.controller");
const reviewRouter = require("../review/review.router");
const bookingRouter = require("../booking/booking.router");
const authController = require("../../../controllers/auth.controller");

// POST /restaurant/d343dsds/review
// GET /restaurant/d343dsds/review
// routeAPI.post("/get-by-id-list", RestaurantController.getAllRestaurants)
routeAPI.use("/:resId/booking", bookingRouter);
routeAPI.use("/:resId/review", reviewRouter);

routeAPI.get("/res-stats", RestaurantController.getTourStats); 
routeAPI.get("/top-5-cheap",RestaurantController.aliasTopRestaurants,
    RestaurantController.getAllRestaurant);
routeAPI.get("/search", RestaurantController.getsearchRestaurant);

routeAPI.get("/", RestaurantController.getAllRestaurant);

routeAPI.post("/",
    authController.protect, 
    authController.restrictTo('admin', 'restaurant-owner'), 
    RestaurantController.postCreateRestaurant
);

routeAPI.get("/pending",
    authController.protect,
    authController.restrictTo('admin'), RestaurantController.getPendingRestaurants);
routeAPI.patch("/respond",
    authController.protect,
    authController.restrictTo('admin'), RestaurantController.respondToRestaurantRequest);

routeAPI.get("/:id", RestaurantController.getRestaurantById);
routeAPI.patch("/:id",
    authController.protect, 
    authController.restrictTo('admin', 'restaurant-owner'),  
    RestaurantController.uploadResImages,
    RestaurantController.resizeResImages,
    RestaurantController.patchUpdateRestaurant);
routeAPI.delete("/:id",
    authController.protect, 
    authController.restrictTo('admin', 'restaurant-owner'), 
    RestaurantController.deleteDelRestaurant);  

routeAPI.get("/category/:cateName", RestaurantController.getRestaurantByCategory);



module.exports = routeAPI;
