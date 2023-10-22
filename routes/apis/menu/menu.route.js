const express = require('express');

const routeAPI = express.Router();

const MenuController = require("../../../controllers/menu/menu.controller");


//routeAPI.get('/',  MenuController.getMenu);
routeAPI.post('/create', MenuController.postCreateMenu);
//routeAPI.put('/update',  MenuController.postCreateMenu);
//routeAPI.put('/delete',  MenuController.postCreateMenu);

module.exports = routeAPI;