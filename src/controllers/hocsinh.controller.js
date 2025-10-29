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

const getProfileByMaHS = async (req, res) => {
  try {
    const { mahs } = req.params;

    const user = await User.findOne({ "hoc_sinh_info.mahs": mahs })
      .select("-password")
      .populate("hoc_sinh_info.xe_id", "bienso tuyen");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy học sinh" });
    }

    res.json(user);
  } catch (error) {
    console.error("Lỗi getProfileByMaHS:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = { setStudentOnBus, getProfileByMaHS };
