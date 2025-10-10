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
