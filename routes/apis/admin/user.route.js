const router = require("express").Router();
const UserController = require("../../../controllers/admin/user.controller");

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);
router.patch("/:id", UserController.editUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
