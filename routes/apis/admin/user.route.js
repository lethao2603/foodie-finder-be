// const router = require("express").Router();
const express = require("express");
const routeAPI = express.Router();
const UserController = require("../../../controllers/admin/user.controller");
const authController = require("../../../controllers/auth.controller");

//Protect all routes after this middleware
routeAPI.use(authController.protect);

routeAPI.get("/me", UserController.getMe, UserController.getUserById);
routeAPI.patch(
  "/updateMe",
  UserController.uploadUserPhoto,
  UserController.resizeUserPhoto,
  UserController.updateMe
);

routeAPI.patch(
  "/updateMyInfo",
  UserController.updateMyInfo
);
routeAPI.delete("/deleteMe", UserController.deleteMe);

routeAPI.use(authController.restrictTo("admin"));

routeAPI.get("/", UserController.getAllUsers);
routeAPI.post("/", UserController.postcreateUser);
routeAPI.get("/:id", UserController.getUserById);
routeAPI.patch("/:id", UserController.patchUpdateUser);
routeAPI.delete("/:id", UserController.deleteUser);

module.exports = routeAPI;
