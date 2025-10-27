// src/models/user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { getCoordinates } = require("../utils/geocoding");

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
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },
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

// Chỉ mục không gian để query khoảng cách
HocSinhInfoSchema.index({ location: "2dsphere" });

// Tự động cập nhật thời gian khi state thay đổi
HocSinhInfoSchema.pre("save", function (next) {
  if (this.isModified("state")) {
    this.state_time = new Date();
  }
  next();
});

const TaiXeInfoSchema = new mongoose.Schema(
  {
    bienso: String,
    tuyen: String,
    mabanglai: String,
  },
  { _id: false }
);

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

HocSinhInfoSchema.pre("save", async function (next) {
  // Nếu có địa điểm và chưa có tọa độ thì tự động lấy
  if (this.isModified("diadiem_don_tra") && this.diadiem_don_tra) {
    const coords = await getCoordinates(this.diadiem_don_tra);
    if (coords) {
      this.location = {
        type: "Point",
        coordinates: [coords.lon, coords.lat], // GeoJSON = [lng, lat]
      };
    }
  }

  // Cập nhật thời gian state
  if (this.isModified("state")) {
    this.state_time = new Date();
  }

  next();
});

module.exports = mongoose.model("User", UserSchema);
