const mongoose = require("mongoose");

const NhatKyHocSinhSchema = new mongoose.Schema({
  hs_id: { type: String, required: true }, // Mã học sinh
  giodon: String,
  giotra: String,
  trangthai: {
    type: String,
    enum: ["chodon", "dangdon", "hoanthanh", "vang"],
    default: "chodon",
  },
});

const NhatKySchema = new mongoose.Schema({
  nhatky_id: { type: String, required: true },
  ngay: { type: String, required: true }, // ví dụ "2025-09-21"
  dshs: [NhatKyHocSinhSchema],
});

const LichTrinhSchema = new mongoose.Schema({
  giobatdau_sang: String,
  gioketthuc_sang: String,
  giobatdau_chieu: String,
  gioketthuc_chieu: String,
});

const XeSchema = new mongoose.Schema(
  {
    bienso: { type: String, required: true },
    suc_chua: { type: Number, required: true },
    tuyen: { type: String, required: true },
    taixe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hoc_sinh_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lich_trinh: LichTrinhSchema,
    nhatky: [NhatKySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Xe", XeSchema);
