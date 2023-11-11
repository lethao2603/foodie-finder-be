const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");

router.post("/register", authController.register);
router.get("/:id/verify/:token/", authController.verifyLink);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/insert_data/:category", authController.insertData);
router.get("/insertUser", authController.fakeDataUser);
router.get("/rating", authController.fakeDataRating);
router.get("/testRCM", authController.fakeInputRCM);
router.get("/transferRCM", authController.fakeTransferRCM);
router.get("/updatedUnique-Restaurant", authController.updatedUniqueRestaurant);
module.exports = router;
