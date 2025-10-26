const express = require("express");
const router = express.Router();
const TaiXeController = require("../controllers/taixe.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Chỉ tài xế đã đăng nhập mới được cập nhật trạng thái
router.put(
  "/:xeId/update-states",
  requireAuth,
  TaiXeController.updateAllHocSinhState
);

router.get("/lich-trinh", requireAuth, TaiXeController.getLichTrinhXeTaiXe);

module.exports = router;
