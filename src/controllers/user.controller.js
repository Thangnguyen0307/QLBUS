const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary.config");
const { sendPasswordEmail } = require("../utils/mailer");

// ✅ Hàm tạo chuỗi password ngẫu nhiên
function generateRandomPassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy thông tin người dùng" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách người dùng" });
  }
};

// ✅ Tạo tài khoản mới (Admin)
const createUserByAdmin = async (req, res) => {
  try {
    const { email, role, profile, hoc_sinh_info, tai_xe_info, admin_info } =
      req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo mật khẩu ngẫu nhiên
    const randomPass = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(randomPass, 10);

    // Tạo user mới
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      isVerified: true, // do admin tạo, không cần xác thực OTP
      profile,
      hoc_sinh_info,
      tai_xe_info,
      admin_info,
    });

    await newUser.save();

    // Gửi email thông báo mật khẩu
    await sendPasswordEmail(email, randomPass);

    res.status(201).json({
      message: "Tạo tài khoản thành công và đã gửi mật khẩu qua email",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi tạo tài khoản người dùng" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cho phép gửi trực tiếp hoặc bọc trong profile
    const body = req.body.profile ? req.body.profile : req.body;

    // Nếu có các field phụ (hoc_sinh_info, v.v.) thì lấy thêm
    const { hoc_sinh_info, tai_xe_info, admin_info } = req.body;

    // Khởi tạo nếu chưa có subdocument
    if (!user.profile) user.profile = {};

    switch (user.role) {
      case "hoc_sinh":
        if (!user.hoc_sinh_info) user.hoc_sinh_info = {};
        user.profile.set(body);
        if (hoc_sinh_info) user.hoc_sinh_info.set(hoc_sinh_info);
        break;

      case "tai_xe":
        if (!user.tai_xe_info) user.tai_xe_info = {};
        user.profile.set(body);
        if (tai_xe_info) user.tai_xe_info.set(tai_xe_info);
        break;

      case "nhan_vien":
        user.profile.set(body);
        break;

      case "admin":
        if (!user.admin_info) user.admin_info = {};
        user.profile.set(body);
        if (hoc_sinh_info) user.hoc_sinh_info.set(hoc_sinh_info);
        if (tai_xe_info) user.tai_xe_info.set(tai_xe_info);
        if (admin_info) user.admin_info.set(admin_info);
        break;

      default:
        return res.status(403).json({ message: "Không có quyền cập nhật" });
    }

    await user.save();
    const updatedUser = await User.findById(userId).select("-password");
    res.json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật thông tin người dùng" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    }

    // req.file.path chứa URL Cloudinary do multer-storage-cloudinary tự upload
    user.profile = user.profile || {};
    user.profile.avatar = req.file.path;
    await user.save();

    res.json({
      message: "Cập nhật avatar thành công",
      avatar: req.file.path,
      user: await User.findById(userId).select("-password"),
    });
  } catch (err) {
    console.error("Upload avatar error:", err);
    res.status(500).json({ message: "Lỗi khi tải lên avatar" });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  createUserByAdmin,
  updateProfile,
  uploadAvatar,
};
