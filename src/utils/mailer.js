const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc smtp.mail.yahoo.com, v.v.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Mã xác thực OTP - Quản lý xe bus",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Mã OTP của bạn là: <span style="color: #007bff;">${otp}</span></h2>
        <p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ với bất kỳ ai.</p>
        <br/>
        <p>Trân trọng,<br/>Hệ thống Quản lý Xe Bus</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
