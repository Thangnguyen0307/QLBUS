// src/services/auth.service.js
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user.model");
const { saveOtp } = require("../services/otp.service");
const { sendOTPEmail } = require("../utils/mailer");

// ✅ Hàm tạo OTP ngẫu nhiên
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function signAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, config.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

async function login(email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Sai email hoặc mật khẩu");

  const valid = await user.comparePassword(password);
  if (!valid) throw new Error("Sai email hoặc mật khẩu");

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return { user, accessToken, refreshToken };
}

async function register(data) {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("Email đã tồn tại");

  // ✅ Tạo user trước
  const user = new User({
    ...data,
    isVerified: false,
  });
  await user.save();

  // ✅ Tạo và lưu OTP riêng
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await saveOtp(user.email, otp, otpExpires);

  // ✅ Gửi email OTP
  await sendOTPEmail(user.email, otp);

  return { user };
}

async function verifyUserByEmail(email) {
  await User.updateOne({ email }, { $set: { isVerified: true } });
}

module.exports = {
  login,
  register,
  verifyUserByEmail,
  signAccessToken,
  signRefreshToken,
};
