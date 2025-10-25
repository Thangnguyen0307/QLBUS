// src/models/xe.model.js
const mongoose = require("mongoose");
const User = require("./user.model");

// Schema lịch trình
const LichTrinhSchema = new mongoose.Schema(
  {
    diadiem: String,
    hoc_sinh_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hoten_hocsinh: String,
    sdt_hocsinh: String,
    phu_huynh: {
      hoten: String,
      sdt: String,
      quanhe: String,
    },
  },
  { _id: false }
);

const HocSinhInXeSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hoten: String,
    ngaysinh: String,
    gioitinh: String,
    sdt: String,
    diachi: String,
    cccd: String,
    avatar: String,
  },
  { _id: false }
);

const XeSchema = new mongoose.Schema(
  {
    code_xe: { type: String, unique: true },
    bienso: { type: String, required: true },
    suc_chua: { type: Number, required: true },
    tuyen: { type: String, required: true },
    taixe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Danh sách học sinh
    hoc_sinh_ids: [HocSinhInXeSchema],

    lich_trinh: [LichTrinhSchema],
  },
  { timestamps: true }
);

//  Auto-generate code_xe (XE0001, XE0002,...)
XeSchema.pre("save", async function (next) {
  // nếu đã có code_xe thì bỏ qua
  if (this.code_xe) return next();

  try {
    const Xe = mongoose.model("Xe");
    const lastXe = await Xe.findOne().sort({ createdAt: -1 }).select("code_xe");

    let nextCodeNumber = 1;
    if (lastXe && lastXe.code_xe) {
      const lastNumber = parseInt(lastXe.code_xe.replace("XE", "")) || 0;
      nextCodeNumber = lastNumber + 1;
    }

    this.code_xe = "XE" + nextCodeNumber.toString().padStart(4, "0");
    next();
  } catch (err) {
    next(err);
  }
});

// Auto build lich_trinh từ học sinh trong xe
XeSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("hoc_sinh_ids")) return next();

    const userIds = this.hoc_sinh_ids.map((hs) => hs.user_id).filter(Boolean);

    if (userIds.length > 0) {
      const users = await User.find({
        _id: { $in: userIds },
        role: "hoc_sinh",
      }).select(
        "profile.hoten profile.sdt hoc_sinh_info.diadiem_don_tra hoc_sinh_info.phu_huynh"
      );

      this.lich_trinh = users
        .map((u) => ({
          diadiem: u.hoc_sinh_info?.diadiem_don_tra || null,
          hoc_sinh_id: u._id,
          hoten_hocsinh: u.profile?.hoten || "",
          sdt_hocsinh: u.profile?.sdt || "",
          phu_huynh: u.hoc_sinh_info?.phu_huynh || {},
        }))
        .filter((l) => l.diadiem);
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Xe", XeSchema);
