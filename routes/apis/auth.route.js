const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");

router.post("/register", authController.register);
router.get("/:id/verify/:token/", authController.verifyLink);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/insert_data/:category", authController.insertData);
//update fields
router.get("/updateField", authController.updateField);
module.exports = router;
