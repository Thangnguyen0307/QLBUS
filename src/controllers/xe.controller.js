//../controllers/xe.controller.js
const Xe = require("../models/xe.model");
const User = require("../models/user.model");

// Lấy tất cả xe (chỉ admin)
const getAllXe = async (req, res) => {
  try {
    const dsXe = await Xe.find()
      .populate("taixe_id", "email profile.hoten")
      .populate("hoc_sinh_ids.user_id", "email profile.hoten profile.sdt");
    const dsXeWithTotal = dsXe.map((xe) => ({
      ...xe.toObject(),
      totalHocSinh: xe.hoc_sinh_ids ? xe.hoc_sinh_ids.length : 0,
    }));
    res.json({
      message: "Lấy danh sách xe thành công",
      total: dsXeWithTotal.length,
      dsXe: dsXeWithTotal,
    });
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
      .populate("hoc_sinh_ids.user_id", "email profile.hoten profile.sdt");

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
    const xe = await Xe.findOne({ taixe_id: userId })
      .populate("taixe_id", "email profile.hoten")
      .populate("hoc_sinh_ids.user_id", "email profile.hoten profile.sdt");

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
    const { bienso, suc_chua, tuyen, taixe_id, hoc_sinh_ids = [] } = req.body;
    // Kiểm tra tài xế hợp lệ
    const taixe = await User.findById(taixe_id);
    if (!taixe || taixe.role !== "tai_xe") {
      return res
        .status(400)
        .json({ message: "Tài xế không hợp lệ hoặc không tồn tại" });
    }
    // Chuẩn hóa danh sách học sinh
    const hocSinhDocs = await Promise.all(
      hoc_sinh_ids.map(async (item) => {
        const user = await User.findById(item.user_id);
        if (!user || user.role !== "hoc_sinh") return null;
        return {
          user_id: user._id,
          hoten: user.profile?.hoten || "",
          ngaysinh: user.profile?.ngaysinh || "",
          gioitinh: user.profile?.gioitinh || "",
          sdt: user.profile?.sdt || "",
          diachi: user.profile?.diachi || "",
          cccd: user.profile?.cccd || "",
          avatar: user.profile?.avatar || "",
        };
      })
    );

    const filteredHocSinh = hocSinhDocs.filter(Boolean);

    const newXe = new Xe({
      bienso,
      suc_chua,
      tuyen,
      taixe_id,
      hoc_sinh_ids: filteredHocSinh,
    });

    await newXe.save();

    // Sau khi tạo xe, gắn xe_id vào tài xế (tai_xe_info)
    taixe.tai_xe_info = {
      ...(taixe.tai_xe_info?.toObject?.() ?? taixe.tai_xe_info ?? {}),
      xe_id: {
        xe_id: newXe._id,
        bienso: newXe.bienso,
        tuyen: newXe.tuyen,
        suc_chua: newXe.suc_chua,
      },
    };

    await taixe.save();

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
    const { bienso, suc_chua, tuyen, taixe_id, hoc_sinh_ids } = req.body;

    const xe = await Xe.findById(id);
    if (!xe) return res.status(404).json({ message: "Không tìm thấy xe" });

    let oldTaixe = null;
    let newTaixe = null;

    // Nếu có đổi tài xế
    if (taixe_id && taixe_id.toString() !== xe.taixe_id?.toString()) {
      if (xe.taixe_id) {
        oldTaixe = await User.findById(xe.taixe_id);
      }

      // Kiểm tra tài xế mới hợp lệ
      newTaixe = await User.findById(taixe_id);
      if (!newTaixe || newTaixe.role !== "tai_xe") {
        return res
          .status(400)
          .json({ message: "Tài xế không hợp lệ hoặc không tồn tại" });
      }

      // Cập nhật xe với tài xế mới
      xe.taixe_id = taixe_id;
    }

    if (bienso) xe.bienso = bienso;
    if (suc_chua) xe.suc_chua = suc_chua;
    if (tuyen) xe.tuyen = tuyen;

    // Cập nhật danh sách hs
    if (Array.isArray(hoc_sinh_ids)) {
      const hocSinhDocs = await Promise.all(
        hoc_sinh_ids.map(async (item) => {
          const user = await User.findById(item.user_id);
          if (!user || user.role !== "hoc_sinh") return null;
          return {
            user_id: user._id,
            hoten: user.profile?.hoten || "",
            ngaysinh: user.profile?.ngaysinh || "",
            gioitinh: user.profile?.gioitinh || "",
            sdt: user.profile?.sdt || "",
            diachi: user.profile?.diachi || "",
            cccd: user.profile?.cccd || "",
            avatar: user.profile?.avatar || "",
          };
        })
      );

      xe.hoc_sinh_ids = hocSinhDocs.filter(Boolean);
    }

    await xe.save();

    // Nếu đổi tài xế thì cập nhật ngược lại cho User
    if (oldTaixe && oldTaixe.tai_xe_info?.xe_id) {
      oldTaixe.tai_xe_info.xe_id = null;
      await oldTaixe.save();
    }

    if (newTaixe) {
      newTaixe.tai_xe_info = {
        ...(newTaixe.tai_xe_info?.toObject?.() ?? newTaixe.tai_xe_info ?? {}),
        xe_id: {
          xe_id: xe._id,
          bienso: xe.bienso,
          tuyen: xe.tuyen,
          suc_chua: xe.suc_chua,
        },
      };
      await newTaixe.save();
    }

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
