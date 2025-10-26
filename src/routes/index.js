const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/xe", require("./xe.routes"));
router.use("/taixe", require("./taixe.routes"));
router.use("/hocsinh", require("./hocsinh.routes"));

module.exports = router;
