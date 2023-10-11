const router = require("express").Router();
const RoleController = require("../../../controllers/admin/role.controller");

router.get("/", RoleController.getAllRoles);
router.get("/:roleId", RoleController.getRoleByRoleId);
router.post("/", RoleController.createRole);
router.patch("/:roleId", RoleController.editRole);
router.delete("/:roleId", RoleController.deleteRole);

module.exports = router;
