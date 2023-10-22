const express = require('express');

const routeAPI = express.Router();

const CategoryController = require("../../../controllers/category/category.controller");

//routeAPI.get('/',  CategoryController.getCategory);
routeAPI.post('/create', CategoryController.postCreateCategory);
//routeAPI.put('/delete',  CategoryController.putUpdateCategory);

module.exports = routeAPI;