/**
 * @swagger
 * tags:
 *   name: Xe
 *   description: Quản lý xe (chỉ dành cho admin và tài xế)
 */

/**
 * @swagger
 * /xe/my:
 *   get:
 *     summary: xem detail xe (chỉ Tài xế và Admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin xe của tài xế
 */

/**
 * @swagger
 * /xe:
 *   get:
 *     summary: Lấy danh sách xe (chỉ admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách xe
 */

/**
 * @swagger
 * /xe/by-driver/{taixe_id}:
 *   get:
 *     summary: Lấy chi tiết xe theo ID tài xế (admin và tài xế)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taixe_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của tài xế (ObjectId từ User)
 *     responses:
 *       200:
 *         description: Trả về thông tin xe của tài xế
 *       404:
 *         description: Không tìm thấy xe
 *       403:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /xe:
 *   post:
 *     summary: Thêm xe mới (chỉ admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               lich_trinh:
 *                 type: object
 *                 properties:
 *                   giobatdau_sang: { type: string, example: "05:30" }
 *                   gioketthuc_sang: { type: string, example: "07:00" }
 *                   giobatdau_chieu: { type: string, example: "17:00" }
 *                   gioketthuc_chieu: { type: string, example: "18:00" }
 *     responses:
 *       201:
 *         description: Tạo xe thành công
 */

/**
 * @swagger
 * /xe/{id}:
 *   put:
 *     summary: Cập nhật thông tin xe (Chỉ admin)
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
 *               suc_chua:
 *                 type: integer
 *               tuyen:
 *                 type: string
 *               taixe_id:
 *                 type: string
 *               lich_trinh:
 *                 type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /xe/{id}:
 *   delete:
 *     summary: Xóa xe (Chỉ admin)
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID xe cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
