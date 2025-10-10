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
 *           example: 66fdfe123abc456def789012
 *         email:
 *           type: string
 *           example: nguyenvana@example.com
 *         role:
 *           type: string
 *           enum: [hoc_sinh, tai_xe, nhan_vien, admin]
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
 *           example: "https://khoinguonsangtao.vn/wp-content/uploads/2022/10/anh-trai-dep-han-quoc.jpg"
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
 *           example: "HS12345"
 *         lop:
 *           type: string
 *           example: "12A1"
 *         phu_huynh:
 *           $ref: '#/components/schemas/PhuHuynh'
 *         diadiem_don:
 *           type: string
 *           example: "123 Nguyễn Trãi, Q5"
 *         diadiem_tra:
 *           type: string
 *           example: "Trường THPT Nguyễn Trãi"
 *         xe_id:
 *           type: string
 *           example: "670adf78e2b33467bb712abc"
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
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin cá nhân người dùng đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (chỉ Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 */

/**
 * @swagger
 * /users/admin-create:
 *   post:
 *     summary: Admin tạo tài khoản người dùng mới
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
 *                 example: user@example.com
 *               role:
 *                 type: string
 *                 enum: [hoc_sinh, tai_xe, nhan_vien, admin]
 *               profile:
 *                 $ref: '#/components/schemas/Profile'
 *               hoc_sinh_info:
 *                 $ref: '#/components/schemas/HocSinhInfo'
 *               tai_xe_info:
 *                 $ref: '#/components/schemas/TaiXeInfo'
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công, đã gửi email mật khẩu
 *       400:
 *         description: Email đã tồn tại
 *       403:
 *         description: Không có quyền (chỉ admin)
 */

/**
 * @swagger
 * /users/update-profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân của người dùng
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
 *               hoten:
 *                 type: string
 *                 example: "Nguyễn Văn B"
 *               ngaysinh:
 *                 type: string
 *                 format: date
 *                 example: "2006-02-14"
 *               gioitinh:
 *                 type: string
 *                 enum: [Nam, Nữ]
 *                 example: "Nữ"
 *               sdt:
 *                 type: string
 *                 example: "0912345678"
 *               diachi:
 *                 type: string
 *                 example: "456 Đường XYZ, Q1, TP.HCM"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin thành công"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */

/**
 * @swagger
 * /users/upload-avatar:
 *   post:
 *     summary: Upload ảnh đại diện (avatar)
 *     description: Upload avatar người dùng lên Cloudinary, trả về URL ảnh.
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
 *                 description: Ảnh đại diện (file .jpg, .png, ...)
 *     responses:
 *       200:
 *         description: Upload thành công, trả về URL ảnh.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload avatar thành công"
 *                 avatarUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/v123/avatar.jpg"
 *       400:
 *         description: Không có file gửi lên
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       500:
 *         description: Lỗi server
 */
