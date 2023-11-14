const express = require('express');
const routeAPI = express.Router();
const CategoryController = require("../../../controllers/category/category.controller");
const authController = require('../../../controllers/auth.controller');

routeAPI.use(authController.protect);
routeAPI.use(authController.restrictTo('admin'));

routeAPI.post("/", CategoryController.postCreateCategory);
routeAPI.get("/", CategoryController.getAllCategory);
routeAPI.get("/:id", CategoryController.getCategoryById);
routeAPI.patch("/:id", CategoryController.patchUpdateCategory);
routeAPI.delete("/:id", CategoryController.deleteDelCategory);

module.exports = routeAPI;