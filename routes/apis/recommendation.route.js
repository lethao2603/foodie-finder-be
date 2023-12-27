const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const recommedationController = require("../../controllers/recommendation/index.controller");

router.post("/update-perferences", recommedationController.updateUserPreferences);
router.post(
  "/based-on-perferences",
  authController.protect,
  recommedationController.getTopNRecommendedBasedOnUserPreferences
);
router.post(
  "/based-on-history",
  authController.protect,
  recommedationController.getTopNRecommendedBasedOnSearchHistory
);
// router.get("/test-find/:tag", recommedationController.testFind)
// router.get("/test", recommedationController.test)
router.get("/getAllReviewById/:id", recommedationController.getAllReviewById);
module.exports = router;
