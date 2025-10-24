// src/routes/user.routes.js
const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const upload = require("../middlewares/uploadCloudinary.middleware");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.get("/me", requireAuth, UserController.getProfile);
router.get("/", requireAuth, requireRole("admin"), UserController.getAllUsers);
router.post(
  "/admin-create",
  requireAuth,
  requireRole("admin"),
  UserController.createUserByAdmin
);
router.put("/update-profile", requireAuth, UserController.updateProfile);
router.post(
  "/upload-avatar",
  requireAuth,
  upload.single("avatar"),
  UserController.uploadAvatar
);
router.put(
  "/update-user/:id",
  requireAuth,
  requireRole("admin"),
  UserController.updateUserByAdmin
);
router.get(
  "/:id",
  requireAuth,
  requireRole("admin"),
  UserController.getUserDetailById
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  UserController.deleteUserById
);
router.get(
  "/hoc-sinh",
  requireAuth,
  requireRole("admin"),
  UserController.getHocSinhByDiaDiem
);

module.exports = router;
