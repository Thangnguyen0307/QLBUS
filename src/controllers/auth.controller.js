const AuthService = require("../services/auth.service");
const { saveOtp, verifyOtp } = require("../services/otp.service");
const { sendOTPEmail } = require("../utils/mailer");

// Đăng ký và gửi OTP
const register = async (req, res) => {
  try {
    const { user } = await AuthService.register(req.body);
    console.log("User sau khi đăng ký:", user);
    // Tạo mã OTP 6 chữ số ngẫu nhiên
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào MongoDB theo email
    await saveOtp(user.email, otpCode, new Date(Date.now() + 5 * 60 * 1000));

    // Gửi OTP qua email
    await sendOTPEmail(user.email, otpCode);

    res.status(201).json({
      message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực OTP",
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 2️⃣ Xác minh OTP theo email
const verifyUserOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const isValid = await verifyOtp(email, otp);

    if (!isValid) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    // Cập nhật user đã xác thực
    await AuthService.verifyUserByEmail(email);

    res.json({ message: "Xác thực tài khoản thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3️⃣ Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(
      email,
      password
    );

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Tài khoản chưa được xác thực OTP" });
    }

    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id; // lấy từ middleware requireAuth
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới" });
    }

    const updated = await AuthService.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    res.json({
      message: "Đổi mật khẩu thành công",
      user: {
        id: updated._id,
        email: updated.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, verifyUserOtp, login, changePassword };
