// src/utils/mailer.js
const SibApiV3Sdk = require("@sendinblue/client");
require("dotenv").config();

const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY
);

// Gửi OTP
async function sendOTPEmail(to, otp) {
  await client.sendTransacEmail({
    sender: { email: process.env.EMAIL_FROM, name: "Quản lý Xe Bus" },
    to: [{ email: to }],
    subject: "Mã xác thực OTP - Quản lý xe bus",
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Mã OTP của bạn là: <span style="color: #007bff;">${otp}</span></h2>
        <p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ với bất kỳ ai.</p>
        <br/>
        <p>Trân trọng,<br/>Hệ thống Quản lý Xe Bus</p>
      </div>
    `,
  });
}

// Gửi mật khẩu tạm khi admin tạo tài khoản
async function sendPasswordEmail(to, password) {
  await client.sendTransacEmail({
    sender: { email: process.env.EMAIL_FROM, name: "Quản lý Xe Bus" },
    to: [{ email: to }],
    subject: "Tài khoản của bạn đã được tạo - Quản lý xe bus",
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Xin chào!</h2>
        <p>Tài khoản của bạn đã được tạo trên hệ thống <b>Quản lý xe bus</b>.</p>
        <p><b>Email đăng nhập:</b> ${to}</p>
        <p><b>Mật khẩu tạm thời:</b> <span style="color:#007bff;">${password}</span></p>
        <p>Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập.</p>
        <br/>
        <p>Trân trọng,<br/>Hệ thống Quản lý Xe Bus</p>
      </div>
    `,
  });
}

module.exports = { sendOTPEmail, sendPasswordEmail };

// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// async function sendOTPEmail(to, otp) {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to,
//     subject: "Mã xác thực OTP - Quản lý xe bus",
//     html: `
//       <div style="font-family: Arial, sans-serif;">
//         <h2>Mã OTP của bạn là: <span style="color: #007bff;">${otp}</span></h2>
//         <p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ với bất kỳ ai.</p>
//         <br/>
//         <p>Trân trọng,<br/>Hệ thống Quản lý Xe Bus</p>
//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }

// // ✅ Gửi email khi admin tạo tài khoản
// async function sendPasswordEmail(to, password) {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to,
//     subject: "Tài khoản của bạn đã được tạo - Quản lý xe bus",
//     html: `
//       <div style="font-family: Arial, sans-serif;">
//         <h2>Xin chào!</h2>
//         <p>Tài khoản của bạn đã được tạo trên hệ thống <b>Quản lý xe bus</b>.</p>
//         <p><b>Email đăng nhập:</b> ${to}</p>
//         <p><b>Mật khẩu tạm thời:</b> <span style="color:#007bff;">${password}</span></p>
//         <p>Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập.</p>
//         <br/>
//         <p>Trân trọng,<br/>Hệ thống Quản lý Xe Bus</p>
//       </div>
//     `,
//   };
//   await transporter.sendMail(mailOptions);
// }

// module.exports = { sendOTPEmail, sendPasswordEmail };
