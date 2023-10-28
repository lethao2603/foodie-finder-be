const express = require("express");

const routeAPI = express.Router();

const RestaurantController = require("../../../controllers/restaurant/restaurant.controller");

routeAPI.get("/", RestaurantController.getAllRestaurant);
routeAPI.get("/search", RestaurantController.getsearchRestaurant);
routeAPI.get("/:id", RestaurantController.getRestaurantById);
routeAPI.post("/create", RestaurantController.postCreateRestaurant);
routeAPI.put("/update", RestaurantController.putUpdateRestaurant);
routeAPI.delete("/delete", RestaurantController.deleteDelRestaurant);
routeAPI.get("/category/:cateName", RestaurantController.getRestaurantByCategory);

module.exports = routeAPI;
