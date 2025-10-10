// src/routes/auth.routes.js

const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.post("/verify-otp", AuthController.verifyUserOtp);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/change-password", requireAuth, AuthController.changePassword);

module.exports = router;
