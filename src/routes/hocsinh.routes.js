const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { setStudentOnBus } = require("../controllers/hocsinh.controller");

router.patch("/state", requireAuth, setStudentOnBus);

module.exports = router;
