// src/services/otp.service.js
const Otp = require("../models/otp.model");

async function saveOtp(email, code, expiresAt) {
  return await Otp.create({ email, code, expiresAt });
}

async function verifyOtp(email, code) {
  const otp = await Otp.findOne({ email, code });
  if (!otp) return false;
  if (otp.expiresAt < new Date()) return false;
  await Otp.deleteOne({ _id: otp._id }); // xóa sau khi dùng
  return true;
}
module.exports = { saveOtp, verifyOtp };
