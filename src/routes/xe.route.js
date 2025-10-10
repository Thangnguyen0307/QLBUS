const router = require("express").Router();
const XeController = require("../controllers/xe.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.get("/xe", requireAuth, requireRole("admin"), XeController.getAllXe);

router.get(
  "/xe/my",
  requireAuth,
  requireRole("tai_xe", "admin"),
  XeController.getXeByTaiXe
);

router.get(
  "/xe/by-driver/:taixe_id",
  requireAuth,
  requireRole(["admin", "tai_xe"]),
  XeController.getXeByTaiXeId
);

router.post("/xe", requireAuth, requireRole("admin"), XeController.createXe);

router.put("/xe/:id", requireAuth, requireRole("admin"), XeController.updateXe);

router.delete(
  "/xe/:id",
  requireAuth,
  requireRole("admin"),
  XeController.deleteXe
);

module.exports = router;
