// const router = require("express").Router();
const express = require("express");
const routeAPI = express.Router();
const UserController = require("../../../controllers/admin/user.controller");

routeAPI.get("/", UserController.getAllUsers);
routeAPI.post("/", UserController.createUser);
routeAPI.get("/:id", UserController.getUserById);
routeAPI.patch("/:id", UserController.editUser);
routeAPI.delete("/:id", UserController.deleteUser);

module.exports = routeAPI;
