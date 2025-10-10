const router = require("express").Router();
const XeController = require("../controllers/xe.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.get("/", requireAuth, requireRole("admin"), XeController.getAllXe);

router.get(
  "/my",
  requireAuth,
  requireRole("tai_xe", "admin"),
  XeController.getXeByTaiXe
);

router.get(
  "/by-driver/:taixe_id",
  requireAuth,
  requireRole("admin", "tai_xe"),
  XeController.getXeByTaiXeId
);

router.get(
  "/:id",
  requireAuth,
  requireRole("admin", "tai_xe"),
  XeController.getXeById
);

router.post("/", requireAuth, requireRole("admin"), XeController.createXe);

router.put("/:id", requireAuth, requireRole("admin"), XeController.updateXe);

router.delete("/:id", requireAuth, requireRole("admin"), XeController.deleteXe);

module.exports = router;
