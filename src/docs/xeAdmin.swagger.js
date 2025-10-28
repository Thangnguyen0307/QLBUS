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
/**
 * @swagger
 * /xe/add-driver:
 *   post:
 *     summary: Gán tài xế vào xe (chỉ admin)
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - xeId
 *               - taixeId
 *             properties:
 *               xeId:
 *                 type: string
 *                 example: 67201e2a2f14b739beea6c55
 *                 description: ID của xe cần gán tài xế
 *               taixeId:
 *                 type: string
 *                 example: 671fe3b92f40d8826e13d890
 *                 description: ID của tài xế cần gán vào xe
 *     responses:
 *       200:
 *         description: Gán tài xế thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gán tài xế vào xe thành công
 *                 xe:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 67201e2a2f14b739beea6c55
 *                     code_xe:
 *                       type: string
 *                       example: XE0005
 *                     bienso:
 *                       type: string
 *                       example: 29A-12345
 *                     tuyen:
 *                       type: string
 *                       example: Hà Nội - Bắc Ninh
 *                     suc_chua:
 *                       type: number
 *                       example: 30
 *                     taixe_id:
 *                       type: string
 *                       example: 671fe3b92f40d8826e13d890
 *       400:
 *         description: Tài xế không hợp lệ hoặc dữ liệu sai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài xế không hợp lệ"
 *       403:
 *         description: Không có quyền truy cập (không phải admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chỉ admin mới được truy cập"
 *       404:
 *         description: Không tìm thấy xe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy xe"
 *       500:
 *         description: Lỗi máy chủ khi gán tài xế
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi khi gán tài xế vào xe"
 */
/**
 * @swagger
 * /api/xe/unassign-driver/{xeId}:
 *   delete:
 *     summary: Gỡ tài xế ra khỏi xe (chỉ admin)
 *     tags: [Admin Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: xeId
 *         in: path
 *         required: true
 *         description: ID của xe cần gỡ tài xế
 *         schema:
 *           type: string
 *           example: 67201e2a2f14b739beea6c55
 *     responses:
 *       200:
 *         description: Gỡ tài xế khỏi xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã gỡ tài xế khỏi xe thành công
 *                 xe:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 67201e2a2f14b739beea6c55
 *                     code_xe:
 *                       type: string
 *                       example: XE0003
 *                     taixe_id:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Xe chưa có tài xế để gỡ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xe này chưa có tài xế"
 *       403:
 *         description: Không có quyền (không phải admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chỉ admin mới được truy cập"
 *       404:
 *         description: Không tìm thấy xe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy xe"
 *       500:
 *         description: Lỗi server khi gỡ tài xế
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi khi gỡ tài xế khỏi xe"
 */
