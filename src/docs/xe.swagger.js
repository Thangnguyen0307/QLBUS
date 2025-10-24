/**
 * @swagger
 * tags:
 *   name: Xe
 *   description: Quản lý xe (chỉ dành cho admin và tài xế)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HocSinhInXe:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: ID của học sinh (ObjectId)
 *           example: "671a9c1f2e8b4f1a2b3c4d5e"
 *         hoten:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         ngaysinh:
 *           type: string
 *           example: "2010-05-12"
 *         gioitinh:
 *           type: string
 *           example: "Nam"
 *         sdt:
 *           type: string
 *           example: "0901234567"
 *         diachi:
 *           type: string
 *           example: "123 Lý Thường Kiệt, Q.10, TP.HCM"
 *         cccd:
 *           type: string
 *           example: "123456789012"
 *         avatar:
 *           type: string
 *           example: "https://res.cloudinary.com/.../avatar.jpg"
 *
 *     LichTrinh:
 *       type: object
 *       properties:
 *         diadiem:
 *           type: string
 *           example: "Trường Tiểu học Hòa Bình"
 *
 *     Xe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "671a9b9d2e8b4f1a2b3c4d5d"
 *         code_xe:
 *           type: string
 *           example: "XE0001"
 *         bienso:
 *           type: string
 *           example: "51B-12345"
 *         suc_chua:
 *           type: integer
 *           example: 30
 *         tuyen:
 *           type: string
 *           example: "Quận 1 - Quận 5 - Quận 10"
 *         taixe_id:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "670f0f95f5a129a3e4d5a2d9"
 *             email:
 *               type: string
 *               example: "driver@gmail.com"
 *             profile:
 *               type: object
 *               properties:
 *                 hoten:
 *                   type: string
 *                   example: "Nguyễn Văn Tài"
 *         hoc_sinh_ids:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/HocSinhInXe"
 *         lich_trinh:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LichTrinh"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /xe:
 *   get:
 *     summary: Lấy danh sách tất cả xe (chỉ Admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách xe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Xe"
 */

/**
 * @swagger
 * /xe/my:
 *   get:
 *     summary: Lấy thông tin xe của tài xế đang đăng nhập
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin xe của tài xế
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Xe"
 *       404:
 *         description: Không có xe được gán cho tài xế
 */

/**
 * @swagger
 * /xe/{id}:
 *   get:
 *     summary: Lấy chi tiết xe theo ID (Admin hoặc tài xế)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID xe cần lấy
 *     responses:
 *       200:
 *         description: Thông tin chi tiết xe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Xe"
 *       404:
 *         description: Không tìm thấy xe
 */

/**
 * @swagger
 * /xe/by-driver/{taixe_id}:
 *   get:
 *     summary: Lấy thông tin xe theo ID tài xế (Admin hoặc tài xế)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: taixe_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID tài xế
 *     responses:
 *       200:
 *         description: Thông tin xe của tài xế
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Xe"
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy xe
 */

/**
 * @swagger
 * /xe:
 *   post:
 *     summary: Thêm xe mới (chỉ Admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bienso
 *               - suc_chua
 *               - tuyen
 *               - taixe_id
 *             properties:
 *               bienso:
 *                 type: string
 *                 example: "51B-12345"
 *               suc_chua:
 *                 type: integer
 *                 example: 30
 *               tuyen:
 *                 type: string
 *                 example: "Quận 1 - Quận 5 - Quận 10"
 *               taixe_id:
 *                 type: string
 *                 example: "670f0f95f5a129a3e4d5a2d9"
 *
 *     responses:
 *       201:
 *         description: Tạo xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Xe"
 */

/**
 * @swagger
 * /xe/{id}:
 *   put:
 *     summary: Cập nhật thông tin xe (chỉ Admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID xe cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bienso:
 *                 type: string
 *                 example: "51B-67890"
 *               suc_chua:
 *                 type: integer
 *                 example: 40
 *               tuyen:
 *                 type: string
 *                 example: "Quận 1 - Quận 10 - Quận Bình Thạnh"
 *               taixe_id:
 *                 type: string
 *                 example: "671a9c1f2e8b4f1a2b3c4d5e"
 *               hoc_sinh_ids:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/HocSinhInXe"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Xe"
 *       404:
 *         description: Không tìm thấy xe
 */

/**
 * @swagger
 * /xe/{id}:
 *   delete:
 *     summary: Xóa xe (chỉ Admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID xe cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy xe
 */
