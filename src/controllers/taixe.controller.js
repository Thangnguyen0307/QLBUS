const Xe = require("../models/xe.model");
const User = require("../models/user.model");

const updateAllHocSinhState = async (req, res) => {
  try {
    const { xeId } = req.params;
    const { state } = req.query;
    const userId = req.user._id;

    // Kiểm tra state hợp lệ
    const allowedStates = ["waiting", "on_bus", "done"];
    if (!allowedStates.includes(state)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    // Kiểm tra xe tồn tại
    const xe = await Xe.findById(xeId);
    if (!xe) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }

    // Kiểm tra người dùng có phải tài xế của xe đó không
    if (!userId || xe.taixe_id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền thay đổi trạng thái của xe này",
      });
    }

    // Cập nhật tất cả học sinh thuộc xe đó
    const result = await User.updateMany(
      { "hoc_sinh_info.xe_id": xeId },
      {
        $set: {
          "hoc_sinh_info.state": state,
          "hoc_sinh_info.state_time": new Date(),
        },
      }
    );

    res.json({
      message: `Đã cập nhật trạng thái ${state} cho toàn bộ học sinh trên xe.`,
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Lỗi cập nhật state học sinh:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi cập nhật trạng thái học sinh" });
  }
};

// Lấy lịch trình xe của tài xế hiện tại
const getLichTrinhXeTaiXe = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "tai_xe") {
      return res
        .status(403)
        .json({ message: "Chỉ tài xế mới được xem lịch trình của mình" });
    }

    const xe = await Xe.findOne({ taixe_id: user._id })
      .populate("hoc_sinh_ids.user_id", "profile.hoten profile.sdt")
      .lean();

    if (!xe) {
      return res.status(404).json({ message: "Bạn chưa được gán vào xe nào" });
    }

    // Trả ra lịch trình, có sắp xếp gần → xa (theo model đã xử lý)
    res.json({
      message: "Lấy lịch trình xe thành công",
      xe_id: xe._id,
      code_xe: xe.code_xe,
      tuyen: xe.tuyen,
      lich_trinh: xe.lich_trinh,
      tong_hoc_sinh: xe.hoc_sinh_ids?.length || 0,
    });
  } catch (err) {
    console.error("❌ Lỗi lấy lịch trình xe:", err);
    res.status(500).json({ message: "Lỗi lấy lịch trình xe của tài xế" });
  }
};

module.exports = {
  updateAllHocSinhState,
  getLichTrinhXeTaiXe,
};
