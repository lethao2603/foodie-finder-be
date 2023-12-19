const router = require("express").Router();
const categoryController = require("./../../../controllers/admin/category.controller");
const authController = require("../../../controllers/auth.controller");
router.use(authController.protect);
router.post("/", categoryController.addCategory);
module.exports = router;
