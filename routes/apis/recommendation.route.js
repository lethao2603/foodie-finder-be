const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const recommedationController = require("../../controllers/recommendation/index.controller");

router.post("/user-perferences", recommedationController.getTopNRecommendedBasedOnUserPreferences);
router.post("/click-history", recommedationController.getTopNRecommendedBasedOnClickHistory);

module.exports = router;