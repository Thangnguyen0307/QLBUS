/**
 * @swagger
 * tags:
 *   name: Admin Xe
 *   description: Quản lý học sinh trong xe (Admin)
 */

/**
 * @swagger
 * /xe/{xeId}/add-hocsinh:
 *   post:
 *     summary: Thêm học sinh vào xe
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: xeId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của xe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hocSinhIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["651f3a1b2c3d4e5f6a7b8c9d", "651f3a1b2c3d4e5f6a7b8c9e"]
 *     responses:
 *       200:
 *         description: Thêm học sinh thành công
 *       400:
 *         description: Có học sinh không hợp lệ
 *       404:
 *         description: Không tìm thấy xe
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /xe/{xeId}/remove-hocsinh/{hocSinhId}:
 *   delete:
 *     summary: Xóa học sinh khỏi xe
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: xeId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của xe
 *       - in: path
 *         name: hocSinhId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của học sinh cần xóa
 *     responses:
 *       200:
 *         description: Xóa học sinh khỏi xe thành công
 *       404:
 *         description: Không tìm thấy xe hoặc học sinh
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /xe/transfer-hocsinh/{hocSinhId}:
 *   post:
 *     summary: Chuyển học sinh từ xe này sang xe khác
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hocSinhId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID học sinh cần chuyển
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newXeId:
 *                 type: string
 *                 example: "651f3a1b2c3d4e5f6a7b8c9f"
 *                 description: ID xe mới
 *     responses:
 *       200:
 *         description: Chuyển học sinh thành công
 *       404:
 *         description: Không tìm thấy học sinh hoặc xe mới
 *       500:
 *         description: Lỗi server
 */
