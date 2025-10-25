// src/models/user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PhuHuynhSchema = new mongoose.Schema(
  {
    hoten: String,
    sdt: String,
    quanhe: String,
  },
  { _id: false }
);

const HocSinhInfoSchema = new mongoose.Schema(
  {
    mahs: String,
    lop: String,
    phu_huynh: PhuHuynhSchema,
    diadiem_don_tra: String,
    xe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Xe" },
    state: {
      type: String,
      enum: ["waiting", "on_bus", "done"],
      default: "done",
    },
    state_time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Tự động cập nhật thời gian khi state thay đổi
HocSinhInfoSchema.pre("save", function (next) {
  if (this.isModified("state")) {
    this.state_time = new Date();
  }
  next();
});

const TaiXeInfoSchema = new mongoose.Schema({
  bienso: String,
  tuyen: String,
  mabanglai: String,
});

const AdminInfoSchema = new mongoose.Schema(
  {
    quyen: [String],
  },
  { _id: false }
);

const ProfileSchema = new mongoose.Schema(
  {
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

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["hoc_sinh", "tai_xe", "nhan_vien", "admin"],
      default: "hoc_sinh",
    },
    isVerified: { type: Boolean, default: false },
    profile: ProfileSchema,
    hoc_sinh_info: HocSinhInfoSchema,
    tai_xe_info: TaiXeInfoSchema,
    admin_info: AdminInfoSchema,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", UserSchema);
