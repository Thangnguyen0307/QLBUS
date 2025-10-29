// src/models/xe.model.js
const mongoose = require("mongoose");
const User = require("./user.model");
const haversine = require("haversine-distance");
const SCHOOL_LOCATION = { lat: 21.004714, lon: 105.843071 }; // Đại học Bách Khoa Hà Nội

// Schema lịch trình
const LichTrinhSchema = new mongoose.Schema(
  {
    diadiem: String,
    hoc_sinh_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hoten_hocsinh: String,
    sdt_hocsinh: String,
    mahs: String,
    avatar: String,
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
      const users = await mongoose
        .model("User")
        .find({
          _id: { $in: userIds },
          role: "hoc_sinh",
        })
        .select(
          "profile.hoten profile.sdt profile.avatar hoc_sinh_info.mahs hoc_sinh_info.diadiem_don_tra hoc_sinh_info.location hoc_sinh_info.phu_huynh"
        );

      // Build lịch trình mới (chỉ cho học sinh chưa có trong lịch trình)
      const existingIds = this.lich_trinh.map((lt) =>
        lt.hoc_sinh_id?.toString()
      );
      const newLichTrinhItems = [];

      for (const u of users) {
        const idStr = u._id.toString();
        if (!existingIds.includes(idStr)) {
          const coords = u.hoc_sinh_info?.location?.coordinates;
          const distance = coords
            ? haversine(
                { lat: SCHOOL_LOCATION.lat, lon: SCHOOL_LOCATION.lon },
                { lat: coords[1], lon: coords[0] }
              )
            : Infinity;

          newLichTrinhItems.push({
            diadiem: u.hoc_sinh_info?.diadiem_don_tra || null,
            hoc_sinh_id: u._id,
            mahs: u.hoc_sinh_info?.mahs || "",
            hoten_hocsinh: u.profile?.hoten || "",
            sdt_hocsinh: u.profile?.sdt || "",
            avatar: u.profile?.avatar || "",
            phu_huynh: u.hoc_sinh_info?.phu_huynh || {},
            distance,
          });
        }
      }

      // Merge lịch trình cũ + mới, rồi sort
      const merged = [
        ...this.lich_trinh.map((lt) => ({
          ...(lt.toObject?.() ?? lt),
          distance: haversine(
            { lat: SCHOOL_LOCATION.lat, lon: SCHOOL_LOCATION.lon },
            {
              lat: lt?.location?.coordinates?.[1] ?? SCHOOL_LOCATION.lat,
              lon: lt?.location?.coordinates?.[0] ?? SCHOOL_LOCATION.lon,
            }
          ),
        })),
        ...newLichTrinhItems,
      ].sort((a, b) => a.distance - b.distance);

      this.lich_trinh = merged.map(({ distance, ...rest }) => rest);
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Xe", XeSchema);
