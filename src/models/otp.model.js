// src/models/otp.model.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // tự động xóa sau 5 phút (TTL Index)
  },
});

module.exports = mongoose.model("Otp", otpSchema);
