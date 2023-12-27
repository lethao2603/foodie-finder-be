const router = require("express").Router();
const RoleController = require("../../../controllers/admin/role.controller");

router.get("/update-recommendation-dataset", RoleController.getAllRoles);

module.exports = router;
