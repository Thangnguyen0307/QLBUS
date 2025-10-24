const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary.config");
const { sendPasswordEmail } = require("../utils/mailer");

// Tạo mật khẩu ngẫu nhiên
function generateRandomPassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

// ✅ Lấy profile người dùng
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy thông tin người dùng" });
  }
};

// ✅ Lấy danh sách người dùng (lọc theo role)
const getAllUsers = async (req, res) => {
  try {
    const { role, sort } = req.query;
    const filter = role && role !== "all" ? { role } : {};

    // Xác định thứ tự sắp xếp, mặc định mới → cũ
    const sortOption = sort === "asc" ? { createdAt: 1 } : { createdAt: -1 };

    const users = await User.find(filter).select("-password").sort(sortOption);

    res.json({
      message: "Lấy danh sách người dùng thành công",
      total: users.length,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách người dùng" });
  }
};

// ✅ Tạo tài khoản mới (Admin)
const createUserByAdmin = async (req, res) => {
  try {
    const { email, role, profile, hoc_sinh_info, tai_xe_info, admin_info } =
      req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email đã tồn tại" });

    const randomPass = generateRandomPassword(10);

    const newUser = new User({
      email,
      password: randomPass,
      role,
      isVerified: true,
      profile,
      hoc_sinh_info,
      tai_xe_info,
      admin_info,
    });

    await newUser.save();
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

// ✅ Cập nhật người dùng (Admin)
const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { profile, hoc_sinh_info, tai_xe_info, admin_info, password } =
      req.body;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (profile) {
      user.profile = user.profile || {};
      user.profile.set(profile);
    }

    if (hoc_sinh_info) {
      user.hoc_sinh_info = user.hoc_sinh_info || {};
      user.hoc_sinh_info.set(hoc_sinh_info);
    }

    if (tai_xe_info) {
      user.tai_xe_info = user.tai_xe_info || {};
      user.tai_xe_info.set(tai_xe_info);
    }

    if (admin_info) {
      user.admin_info = user.admin_info || {};
      user.admin_info.set(admin_info);
    }

    // Cập nhật mật khẩu nếu có
    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await sendPasswordEmail(user.email, password);
    }

    await user.save();
    const updatedUser = await User.findById(id).select("-password");

    res.json({
      message: "Cập nhật người dùng thành công",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật người dùng" });
  }
};

// ✅ Cập nhật thông tin cá nhân
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const body = req.body.profile ? req.body.profile : req.body;
    const { hoc_sinh_info, tai_xe_info, admin_info } = req.body;

    if (!user.profile) user.profile = {};
    user.profile.set(body);

    if (user.role === "hoc_sinh") {
      if (hoc_sinh_info) {
        user.hoc_sinh_info = user.hoc_sinh_info || {};
        user.hoc_sinh_info.set(hoc_sinh_info);
      }
    } else if (user.role === "tai_xe") {
      if (tai_xe_info) {
        user.tai_xe_info = user.tai_xe_info || {};
        user.tai_xe_info.set(tai_xe_info);
      }
    } else if (user.role === "admin") {
      if (admin_info) {
        user.admin_info = user.admin_info || {};
        user.admin_info.set(admin_info);
      }
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

// ✅ Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    }

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

// ✅ Lấy học sinh theo địa điểm đón/trả (dùng field mới)
const getHocSinhByDiaDiem = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới được truy cập" });
    }

    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ message: "Vui lòng cung cấp địa điểm" });
    }

    const hocSinhList = await User.find({
      role: "hoc_sinh",
      "hoc_sinh_info.diadiem_don_tra": { $regex: location, $options: "i" },
    }).select("profile hoc_sinh_info");

    res.json({
      message: "Lấy danh sách học sinh thành công",
      total: hocSinhList.length,
      hocSinhList,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi truy vấn học sinh theo địa điểm" });
  }
};

// ✅ Lấy chi tiết user theo ID (Admin)
const getUserDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    // Chỉ admin mới được truy cập
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới được truy cập" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({
      message: "Lấy thông tin người dùng thành công",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
};

// ✅ Xóa user theo ID (Admin)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Chỉ admin mới được truy cập
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới được truy cập" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    await User.deleteOne({ _id: id });

    res.json({
      message: "Xóa người dùng thành công",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa người dùng" });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  updateProfile,
  uploadAvatar,
  getHocSinhByDiaDiem,
  getUserDetailById,
  deleteUserById,
};
