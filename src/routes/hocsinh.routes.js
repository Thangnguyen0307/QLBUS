const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const {
  setStudentOnBus,
  getProfileByMaHS,
} = require("../controllers/hocsinh.controller");

router.patch("/state", requireAuth, setStudentOnBus);

router.get("/profile/:mahs", getProfileByMaHS);

module.exports = router;
