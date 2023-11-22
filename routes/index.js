const router = require("express").Router();
const testController = require("../controllers/test.controller");
const apisRouter = require("./apis");

router.use("/api", apisRouter);
router.use("/test/slugify-existing-restaurants", testController.slugifyRestaurant);
router.use("/test/build-tag-system", testController.buildTagSystem);
router.use("/test/init-config", testController.initPersonalConfig);
module.exports = router;
