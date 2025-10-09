const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.get("/me", requireAuth, UserController.getProfile);
router.get("/", requireAuth, requireRole("admin"), UserController.getAllUsers);

module.exports = router;
