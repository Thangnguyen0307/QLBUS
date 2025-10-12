// src/controllers/xeAdmin.controller.js
const Xe = require("../models/xe.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// ✅ Thêm học sinh vào xe
const addHocSinhToXe = async (req, res) => {
  try {
    const { xeId } = req.params;
    const { hocSinhIds } = req.body;

    const xe = await Xe.findById(xeId);
    if (!xe) return res.status(404).json({ message: "Không tìm thấy xe" });

    // Kiểm tra từng học sinh
    const hocSinhList = await User.find({
      _id: { $in: hocSinhIds },
      role: "hoc_sinh",
    });

    if (hocSinhList.length !== hocSinhIds.length) {
      return res.status(400).json({ message: "Có học sinh không hợp lệ" });
    }

    // Cập nhật xe_id của học sinh và thêm vào xe.hoc_sinh_ids nếu chưa có
    for (const hs of hocSinhList) {
      hs.hoc_sinh_info.xe_id = xe._id;
      await hs.save();
      if (!xe.hoc_sinh_ids.includes(hs._id)) {
        xe.hoc_sinh_ids.push(hs._id);
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

    xe.hoc_sinh_ids = xe.hoc_sinh_ids.filter(
      (id) => id.toString() !== hocSinhId
    );

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
    if (!hs || hs.role !== "hoc_sinh")
      return res.status(404).json({ message: "Không tìm thấy học sinh" });

    const oldXeId = hs.hoc_sinh_info.xe_id;
    const oldXe = oldXeId ? await Xe.findById(oldXeId) : null;
    const newXe = await Xe.findById(newXeId);
    if (!newXe)
      return res.status(404).json({ message: "Không tìm thấy xe mới" });

    // Xóa khỏi xe cũ
    if (oldXe) {
      oldXe.hoc_sinh_ids = oldXe.hoc_sinh_ids.filter(
        (id) => id.toString() !== hocSinhId
      );
      await oldXe.save();
    }

    // Thêm vào xe mới
    hs.hoc_sinh_info.xe_id = newXe._id;
    await hs.save();

    if (!newXe.hoc_sinh_ids.includes(hs._id)) {
      newXe.hoc_sinh_ids.push(hs._id);
      await newXe.save();
    }

    res.json({ message: "Chuyển học sinh thành công", hoc_sinh: hs, newXe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi chuyển học sinh" });
  }
};

module.exports = {
  addHocSinhToXe,
  removeHocSinhFromXe,
  transferHocSinh,
};
