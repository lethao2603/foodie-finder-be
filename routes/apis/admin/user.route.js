// const router = require("express").Router();
const express = require("express");
const routeAPI = express.Router();
const UserController = require("../../../controllers/admin/user.controller");

routeAPI.get("/", UserController.getAllUsers); //Admin 
routeAPI.post("/", UserController.postcreateUser); //Admin 
routeAPI.get("/:id", UserController.getUserById); // Restaurant Owner, Customer
routeAPI.patch("/:id", UserController.patchUpdateUser);//Admin, Restaurant Owner, Customer
routeAPI.delete("/:id", UserController.deleteUser); // Admin

module.exports = routeAPI;
