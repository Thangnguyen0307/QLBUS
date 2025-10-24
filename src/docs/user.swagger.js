/**
 * @swagger
 * components:
 *   schemas:
 *     # ======================= USER =======================
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6710ab1234cd5678ef901234
 *         email:
 *           type: string
 *           example: nguyenvana@example.com
 *         role:
 *           type: string
 *           enum: [hoc_sinh, tai_xe, admin]
 *           example: hoc_sinh
 *         isVerified:
 *           type: boolean
 *           example: true
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 *         hoc_sinh_info:
 *           $ref: '#/components/schemas/HocSinhInfo'
 *         tai_xe_info:
 *           $ref: '#/components/schemas/TaiXeInfo'
 *         admin_info:
 *           $ref: '#/components/schemas/AdminInfo'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # ======================= PROFILE =======================
 *     Profile:
 *       type: object
 *       properties:
 *         hoten:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         ngaysinh:
 *           type: string
 *           format: date
 *           example: "2005-09-12"
 *         gioitinh:
 *           type: string
 *           enum: [Nam, Nữ]
 *           example: "Nam"
 *         sdt:
 *           type: string
 *           example: "0901234567"
 *         diachi:
 *           type: string
 *           example: "123 Đường ABC, TP.HCM"
 *         cccd:
 *           type: string
 *           example: "079203001234"
 *         avatar:
 *           type: string
 *           example: "https://cdn.example.com/avatar.jpg"
 *
 *     # ======================= PHỤ HUYNH =======================
 *     PhuHuynh:
 *       type: object
 *       properties:
 *         hoten:
 *           type: string
 *           example: "Trần Thị B"
 *         sdt:
 *           type: string
 *           example: "0912345678"
 *         quanhe:
 *           type: string
 *           example: "Mẹ"
 *
 *     # ======================= HỌC SINH INFO =======================
 *     HocSinhInfo:
 *       type: object
 *       properties:
 *         mahs:
 *           type: string
 *           example: "HS001"
 *         lop:
 *           type: string
 *           example: "12A1"
 *         phu_huynh:
 *           $ref: '#/components/schemas/PhuHuynh'
 *         diadiem_don_tra:
 *           type: string
 *           example: "Trường THPT Nguyễn Trãi"
 *         state:
 *           type: string
 *           enum: [waiting, on_bus, done]
 *           example: "done"
 *         state_time:
 *           type: string
 *           format: date-time
 *           example: "2025-10-25T08:30:00Z"
 *
 *     # ======================= TÀI XẾ INFO =======================
 *     TaiXeInfo:
 *       type: object
 *       properties:
 *         bienso:
 *           type: string
 *           example: "51B-123.45"
 *         tuyen:
 *           type: string
 *           example: "Tuyến số 3: Gò Vấp - Quận 1"
 *         mabanglai:
 *           type: string
 *           example: "B2-123456789"
 *
 *     # ======================= ADMIN INFO =======================
 *     AdminInfo:
 *       type: object
 *       properties:
 *         quyen:
 *           type: array
 *           items:
 *             type: string
 *           example: ["quan_ly_tai_khoan", "xem_bao_cao"]
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Quản lý tài khoản người dùng
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin cá nhân của người dùng đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin user hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token không hợp lệ hoặc chưa đăng nhập
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [all, hoc_sinh, tai_xe, nhan_vien, admin]
 *         description: Lọc theo vai trò (mặc định là all)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sắp xếp theo `createdAt`, `asc` = cũ → mới, `desc` = mới → cũ
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 12
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /users/admin-create:
 *   post:
 *     summary: Admin tạo tài khoản mới cho người dùng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "hoc_sinh_a@example.com"
 *               role:
 *                 type: string
 *                 enum: [hoc_sinh, tai_xe, admin]
 *               profile:
 *                 $ref: '#/components/schemas/Profile'
 *               hoc_sinh_info:
 *                 $ref: '#/components/schemas/HocSinhInfo'
 *               tai_xe_info:
 *                 $ref: '#/components/schemas/TaiXeInfo'
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công, đã gửi mật khẩu qua email
 *       400:
 *         description: Email đã tồn tại
 */

/**
 * @swagger
 * /users/update-profile:
 *   put:
 *     summary: Người dùng cập nhật thông tin cá nhân của mình
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 $ref: '#/components/schemas/Profile'
 *               hoc_sinh_info:
 *                 $ref: '#/components/schemas/HocSinhInfo'
 *               tai_xe_info:
 *                 $ref: '#/components/schemas/TaiXeInfo'
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /users/upload-avatar:
 *   post:
 *     summary: Upload ảnh đại diện người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện (.jpg, .png, ...)
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload avatar thành công"
 *                 avatar:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../avatar.jpg"
 *       400:
 *         description: Không có file gửi lên
 */
