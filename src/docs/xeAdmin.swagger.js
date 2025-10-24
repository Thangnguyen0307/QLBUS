/**
 * @swagger
 * tags:
 *   name: Admin Xe
 *   description: Quản lý học sinh trong xe (chỉ dành cho Admin)
 */

/**
 * @swagger
 * /xe/{xeId}/add-hocsinh:
 *   post:
 *     summary: Thêm một hoặc nhiều học sinh vào xe
 *     description: Admin có thể thêm danh sách học sinh vào một xe nhất định. Mỗi học sinh phải có role = "hoc_sinh".
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: xeId
 *         required: true
 *         description: ID của xe cần thêm học sinh vào
 *         schema:
 *           type: string
 *           example: "671a2b4f7f0e4a001234abcd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hocSinhIds
 *             properties:
 *               hocSinhIds:
 *                 type: array
 *                 description: Danh sách ID học sinh cần thêm vào xe
 *                 items:
 *                   type: string
 *                   example: "671a2b4f7f0e4a001234abcd"
 *     responses:
 *       200:
 *         description: Thêm học sinh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thêm học sinh vào xe thành công"
 *                 xe:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     code_xe:
 *                       type: string
 *                       example: "XE0005"
 *                     bienso:
 *                       type: string
 *                       example: "51B-12345"
 *                     tuyen:
 *                       type: string
 *                       example: "Quận 1 - Quận 5 - Quận 10"
 *                     hoc_sinh_ids:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id: { type: string, example: "671a2b4f7f0e4a001234abc1" }
 *                           hoten: { type: string, example: "Nguyễn Văn A" }
 *                           sdt: { type: string, example: "0909123456" }
 *                           diachi: { type: string, example: "123 Lê Lợi, Quận 1" }
 *       400:
 *         description: Có học sinh không hợp lệ hoặc không tồn tại
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
 *     description: Admin xóa một học sinh ra khỏi xe, đồng thời xóa `xe_id` trong thông tin học sinh.
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: xeId
 *         required: true
 *         description: ID của xe
 *         schema:
 *           type: string
 *           example: "671a2b4f7f0e4a001234abcd"
 *       - in: path
 *         name: hocSinhId
 *         required: true
 *         description: ID học sinh cần xóa khỏi xe
 *         schema:
 *           type: string
 *           example: "671a2b4f7f0e4a001234abc1"
 *     responses:
 *       200:
 *         description: Xóa học sinh khỏi xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa học sinh khỏi xe thành công"
 *                 xe:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     hoc_sinh_ids:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id: { type: string, example: "671a2b4f7f0e4a001234abc9" }
 *                           hoten: { type: string, example: "Trần Thị B" }
 *       404:
 *         description: Không tìm thấy xe hoặc học sinh
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /xe/transfer-hocsinh/{hocSinhId}:
 *   post:
 *     summary: Chuyển học sinh sang xe khác
 *     description: Admin chuyển một học sinh từ xe hiện tại sang xe mới, tự động cập nhật danh sách `hoc_sinh_ids` của hai xe và `xe_id` của học sinh.
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hocSinhId
 *         required: true
 *         description: ID học sinh cần chuyển xe
 *         schema:
 *           type: string
 *           example: "671a2b4f7f0e4a001234abc1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newXeId
 *             properties:
 *               newXeId:
 *                 type: string
 *                 example: "671a2b4f7f0e4a001234abc9"
 *                 description: ID xe mới mà học sinh sẽ được chuyển đến
 *     responses:
 *       200:
 *         description: Chuyển học sinh sang xe mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chuyển học sinh sang xe mới thành công"
 *                 hoc_sinh:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "671a2b4f7f0e4a001234abc1" }
 *                     profile:
 *                       type: object
 *                       properties:
 *                         hoten: { type: string, example: "Nguyễn Văn A" }
 *                 newXe:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "671a2b4f7f0e4a001234abc9" }
 *                     bienso: { type: string, example: "51B-67890" }
 *                     hoc_sinh_ids:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id: { type: string, example: "671a2b4f7f0e4a001234abc1" }
 *                           hoten: { type: string, example: "Nguyễn Văn A" }
 *       404:
 *         description: Không tìm thấy học sinh hoặc xe mới
 *       500:
 *         description: Lỗi server
 */
