const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const recommedationController = require("../../controllers/recommendation/index.controller");
const restaurantController = require("../../controllers/restaurant/restaurant.controller");

router.post("/update-perferences", recommedationController.updateUserPreferences);
router.post(
  "/based-on-perferences",
  authController.protect,
  recommedationController.getTopNRecommendedBasedOnUserPreferences
);
router.post("/based-on-history", authController.protect, recommedationController.getTopNRecommendedBasedOnSearchHistory);
router.post("/get-by-id-list", authController.protect, restaurantController.getByIds)
// router.get("/test-find/:tag", recommedationController.testFind)
// router.get("/test", recommedationController.test)
module.exports = router;
