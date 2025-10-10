const Xe = require("../models/xe.model");
const User = require("../models/user.model");

// Lấy tất cả xe (chỉ admin)
const getAllXe = async (req, res) => {
  try {
    const dsXe = await Xe.find().populate("taixe_id", "email profile.hoten");
    res.json(dsXe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách xe" });
  }
};

// Lấy xe theo ID tài xế (admin)
const getXeByTaiXeId = async (req, res) => {
  try {
    const { taixe_id } = req.params;
    const user = req.user;

    // Nếu là tài xế, chỉ được xem xe của chính mình
    if (user.role === "tai_xe" && user._id.toString() !== taixe_id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem xe của tài xế khác" });
    }

    const xe = await Xe.findOne({ taixe_id })
      .populate("taixe_id", "email profile.hoten role")
      .lean();

    if (!xe) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy xe của tài xế này" });
    }

    res.json({
      message: "Lấy thông tin xe thành công",
      xe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy thông tin xe theo tài xế" });
  }
};

// Lấy xe của tài xế hiện tại
const getXeByTaiXe = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware xác thực JWT
    const xe = await Xe.findOne({ taixe_id: userId }).populate(
      "taixe_id",
      "email profile.hoten"
    );

    if (!xe) {
      return res.status(404).json({ message: "Bạn chưa được gán xe nào" });
    }

    res.json(xe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy thông tin xe của tài xế" });
  }
};

// Lấy xe theo ID xe (admin và tài xế)
const getXeById = async (req, res) => {
  try {
    const { id } = req.params;

    const xe = await Xe.findById(id).populate(
      "taixe_id",
      "email profile.hoten role"
    );

    if (!xe) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }

    res.json({
      message: "Lấy chi tiết xe thành công",
      xe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy chi tiết xe" });
  }
};

// Tạo mới xe
const createXe = async (req, res) => {
  try {
    const { bienso, suc_chua, tuyen, taixe_id, lich_trinh } = req.body;

    // Kiểm tra tài xế tồn tại và có role = tai_xe
    const taixe = await User.findById(taixe_id);
    if (!taixe || taixe.role !== "tai_xe") {
      return res
        .status(400)
        .json({ message: "Tài xế không hợp lệ hoặc không tồn tại" });
    }

    const newXe = new Xe({
      bienso,
      suc_chua,
      tuyen,
      taixe_id,
      lich_trinh,
    });

    await newXe.save();
    res.status(201).json({
      message: "Tạo xe thành công",
      xe: newXe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi tạo xe mới" });
  }
};

// Cập nhật xe
const updateXe = async (req, res) => {
  try {
    const { id } = req.params;
    const { bienso, suc_chua, tuyen, taixe_id, lich_trinh } = req.body;

    const xe = await Xe.findById(id);
    if (!xe) return res.status(404).json({ message: "Không tìm thấy xe" });

    // Nếu có thay đổi tài xế, kiểm tra role
    if (taixe_id) {
      const taixe = await User.findById(taixe_id);
      if (!taixe || taixe.role !== "tai_xe") {
        return res
          .status(400)
          .json({ message: "Tài xế không hợp lệ hoặc không tồn tại" });
      }
      xe.taixe_id = taixe_id;
    }

    if (bienso) xe.bienso = bienso;
    if (suc_chua) xe.suc_chua = suc_chua;
    if (tuyen) xe.tuyen = tuyen;
    if (lich_trinh) xe.lich_trinh = lich_trinh;

    await xe.save();
    res.json({ message: "Cập nhật xe thành công", xe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật xe" });
  }
};

// ✅ Xóa xe
const deleteXe = async (req, res) => {
  try {
    const { id } = req.params;
    const xe = await Xe.findByIdAndDelete(id);
    if (!xe) return res.status(404).json({ message: "Không tìm thấy xe" });
    res.json({ message: "Xóa xe thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa xe" });
  }
};

module.exports = {
  getAllXe,
  getXeByTaiXe,
  getXeByTaiXeId,
  getXeById,
  createXe,
  updateXe,
  deleteXe,
};
