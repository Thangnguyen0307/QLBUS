//../controllers/xeAdmin.controller.js
const Xe = require("../models/xe.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// ✅ Thêm học sinh vào xe
const addHocSinhToXe = async (req, res) => {
  try {
    const { xeId } = req.params;
    const { hocSinhIds } = req.body; // mảng user_id

    const xe = await Xe.findById(xeId);
    if (!xe) return res.status(404).json({ message: "Không tìm thấy xe" });

    const hocSinhList = await User.find({
      _id: { $in: hocSinhIds },
      role: "hoc_sinh",
    });

    if (hocSinhList.length !== hocSinhIds.length) {
      return res.status(400).json({ message: "Có học sinh không hợp lệ" });
    }

    // Thêm từng học sinh vào danh sách xe
    for (const hs of hocSinhList) {
      // Cập nhật xe_id cho học sinh
      hs.hoc_sinh_info.xe_id = xe._id;
      await hs.save();

      // Kiểm tra xem đã tồn tại trong xe chưa
      const existed = xe.hoc_sinh_ids.some(
        (item) => item.user_id.toString() === hs._id.toString()
      );
      if (!existed) {
        xe.hoc_sinh_ids.push({
          user_id: hs._id,
          hoten: hs.profile?.hoten || "",
          ngaysinh: hs.profile?.ngaysinh || "",
          gioitinh: hs.profile?.gioitinh || "",
          sdt: hs.profile?.sdt || "",
          diachi: hs.hoc_sinh_info?.diadiem_don_tra || "",
          cccd: hs.profile?.cccd || "",
          avatar: hs.profile?.avatar || "",
        });
      }
    }

    await xe.save();

    res.json({ message: "Thêm học sinh vào xe thành công", xe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi thêm học sinh vào xe" });
  }
};

// ✅ Xóa học sinh khỏi xe
const removeHocSinhFromXe = async (req, res) => {
  try {
    const { xeId, hocSinhId } = req.params;

    const xe = await Xe.findById(xeId);
    if (!xe) return res.status(404).json({ message: "Không tìm thấy xe" });

    // Lọc bỏ học sinh ra khỏi danh sách xe
    xe.hoc_sinh_ids = xe.hoc_sinh_ids.filter(
      (hs) => hs.user_id.toString() !== hocSinhId
    );

    // Đồng thời xóa luôn lịch trình của học sinh đó
    xe.lich_trinh = xe.lich_trinh.filter(
      (lt) => lt.hoc_sinh_id.toString() !== hocSinhId
    );

    // Xóa tham chiếu trong học sinh
    const hs = await User.findById(hocSinhId);
    if (hs && hs.role === "hoc_sinh") {
      hs.hoc_sinh_info.xe_id = null;
      await hs.save();
    }

    await xe.save();

    res.json({ message: "Xóa học sinh khỏi xe thành công", xe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa học sinh khỏi xe" });
  }
};

// ✅ Chuyển học sinh từ xe này sang xe khác
const transferHocSinh = async (req, res) => {
  try {
    const { hocSinhId } = req.params;
    const { newXeId } = req.body;

    const hs = await User.findById(hocSinhId);
    if (!hs || hs.role !== "hoc_sinh") {
      return res.status(404).json({ message: "Không tìm thấy học sinh" });
    }

    const oldXeId = hs.hoc_sinh_info?.xe_id;
    const oldXe = oldXeId ? await Xe.findById(oldXeId) : null;
    const newXe = await Xe.findById(newXeId);

    if (!newXe)
      return res.status(404).json({ message: "Không tìm thấy xe mới" });

    // Xóa khỏi xe cũ (nếu có)
    if (oldXe) {
      oldXe.hoc_sinh_ids = oldXe.hoc_sinh_ids.filter(
        (hsObj) => hsObj.user_id.toString() !== hocSinhId
      );
      await oldXe.save();
    }

    // Cập nhật học sinh
    hs.hoc_sinh_info.xe_id = newXe._id;
    await hs.save();

    // Thêm vào xe mới (đủ dữ liệu học sinh)
    const existed = newXe.hoc_sinh_ids.some(
      (hsObj) => hsObj.user_id.toString() === hocSinhId
    );
    if (!existed) {
      newXe.hoc_sinh_ids.push({
        user_id: hs._id,
        hoten: hs.profile?.hoten || "",
        ngaysinh: hs.profile?.ngaysinh || "",
        gioitinh: hs.profile?.gioitinh || "",
        sdt: hs.profile?.sdt || "",
        diachi: hs.profile?.diachi || "",
        cccd: hs.profile?.cccd || "",
        avatar: hs.profile?.avatar || "",
      });
      await newXe.save();
    }

    res.json({
      message: "Chuyển học sinh sang xe mới thành công",
      hoc_sinh: hs,
      newXe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi chuyển học sinh" });
  }
};

// API gán tài xế vào xe
const DriverToXe = async (req, res) => {
  try {
    const { xeId, taixeId } = req.body;

    // Chỉ admin mới được thực hiện
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới được truy cập" });
    }

    // Kiểm tra xe tồn tại
    const xe = await Xe.findById(xeId);
    if (!xe) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }

    // Kiểm tra tài xế hợp lệ
    const taixe = await User.findById(taixeId);
    if (!taixe || taixe.role !== "tai_xe") {
      return res.status(400).json({ message: "Tài xế không hợp lệ" });
    }

    // Nếu tài xế này đang được gán ở xe khác → gỡ ra
    await Xe.updateMany({ taixe_id: taixeId }, { $set: { taixe_id: null } });

    // Gán tài xế mới cho xe này
    xe.taixe_id = taixeId;
    await xe.save();

    res.json({
      message: "Gán tài xế vào xe thành công",
      xe,
    });
  } catch (err) {
    console.error("❌ Lỗi khi gán tài xế:", err);
    res.status(500).json({ message: "Lỗi khi gán tài xế vào xe" });
  }
};

const removeDriverFromXe = async (req, res) => {
  try {
    const { xeId } = req.params;

    // Chỉ admin mới được phép
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới được truy cập" });
    }

    const xe = await Xe.findById(xeId);
    if (!xe) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }

    // Nếu xe chưa có tài xế thì báo lỗi
    if (!xe.taixe_id) {
      return res.status(400).json({ message: "Xe này chưa có tài xế để xóa" });
    }

    // Gỡ tài xế
    xe.taixe_id = null;
    await xe.save();

    res.json({
      message: "Xóa tài xế khỏi xe thành công",
      xe,
    });
  } catch (err) {
    console.error("❌ Lỗi khi xóa tài xế khỏi xe:", err);
    res.status(500).json({ message: "Lỗi khi xóa tài xế khỏi xe" });
  }
};

module.exports = {
  addHocSinhToXe,
  removeHocSinhFromXe,
  transferHocSinh,
  DriverToXe,
  removeDriverFromXe,
};
