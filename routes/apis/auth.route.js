const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.get("/:id/verify/:token/", authController.verifyLink);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/insert_data/:category", authController.insertData);
module.exports = router;
