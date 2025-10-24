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
 *       - `admin` — chỉ admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [all, hoc_sinh, tai_xe, admin]
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
 *                   example: "Cập nhật người dùng thành công"
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
 *     summary: Lấy danh sách học sinh theo địa điểm đón/trả
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
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Thiếu tham số location
 *       403:
 *         description: Không có quyền truy cập (chỉ admin)
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy chi tiết người dùng theo ID (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng cần lấy chi tiết
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin người dùng thành công"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng theo ID (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa người dùng thành công"
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
