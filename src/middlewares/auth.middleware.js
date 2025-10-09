const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../config");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Thiếu token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Không có quyền truy cập" });
    next();
  };
}

module.exports = { requireAuth, requireRole };
