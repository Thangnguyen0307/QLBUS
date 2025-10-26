const User = require("../models/user.model");

const setStudentOnBus = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "hoc_sinh") {
      return res
        .status(403)
        .json({ message: "Chỉ học sinh mới được thay đổi state" });
    }

    // Đổi state sang "on_bus"
    user.hoc_sinh_info.state = "on_bus";
    user.hoc_sinh_info.state_time = new Date();

    await user.save();

    res.json({
      message: "Trạng thái đã đổi sang 'on_bus'",
      hoc_sinh_info: user.hoc_sinh_info,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { setStudentOnBus };
