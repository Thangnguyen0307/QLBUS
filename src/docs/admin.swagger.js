/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Quản lý người dùng (chỉ dành cho admin)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng (lọc theo vai trò)
 *     tags: [Admin]
 *     description: |
 *       API này cho phép Admin lấy danh sách người dùng trong hệ thống.
 *       Có thể lọc theo vai trò (`role`) gồm:
 *       - `all` — tất cả người dùng
 *       - `hoc_sinh` — chỉ học sinh
 *       - `tai_xe` — chỉ tài xế
 *       - `nhan_vien` — chỉ nhân viên
 *       - `admin` — chỉ admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [all, hoc_sinh, tai_xe, nhan_vien, admin]
 *           default: all
 *         description: Lọc người dùng theo vai trò (mặc định là tất cả)
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 *       500:
 *         description: Lỗi server khi truy xuất danh sách người dùng
 */

/**
 * @swagger
 * /users/update-user/{id}:
 *   put:
 *     summary: Admin chỉnh sửa thông tin người dùng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng cần chỉnh sửa
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
 *               admin_info:
 *                 $ref: '#/components/schemas/AdminInfo'
 *               password:
 *                 type: string
 *                 description: Mật khẩu mới (nếu muốn đổi)
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /users/hoc-sinh:
 *   get:
 *     summary: Lấy danh sách học sinh theo địa điểm đón hoặc trả
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [don, tra]
 *           default: don
 *         description: Loại địa điểm, 'don' = địa điểm đón, 'tra' = địa điểm trả
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên địa điểm muốn filter (ví dụ "Quận 3")
 *     responses:
 *       200:
 *         description: Danh sách học sinh tìm được
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách học sinh thành công"
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 hocSinhList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64fdf123abc456def789012"
 *                       profile:
 *                         type: object
 *                         properties:
 *                           hoten:
 *                             type: string
 *                             example: "Nguyễn Văn A"
 *                           sdt:
 *                             type: string
 *                             example: "0901234567"
 *                           diachi:
 *                             type: string
 *                             example: "123 Nguyễn Trãi, Quận 3"
 *                       hoc_sinh_info:
 *                         type: object
 *                         properties:
 *                           mahs:
 *                             type: string
 *                             example: "HS001"
 *                           lop:
 *                             type: string
 *                             example: "12A1"
 *                           diadiem_don:
 *                             type: string
 *                             example: "123 Nguyễn Trãi, Quận 3"
 *                           diadiem_tra:
 *                             type: string
 *                             example: "Trường THPT Nguyễn Trãi"
 *       400:
 *         description: Thiếu tham số location
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 *       500:
 *         description: Lỗi server
 */
