/**
 * @swagger
 * tags:
 *   name: Tai xe
 *   description: Tài Xế Quản lý xe (chỉ dành cho tài xế)
 */

/**
 * @swagger
 * /taixe/{xeId}/update-states:
 *   put:
 *     summary: Cập nhật trạng thái toàn bộ học sinh trên xe (waiting hoặc done)
 *     description: |
 *       Chỉ **tài xế** của xe đó mới có quyền thay đổi trạng thái của toàn bộ học sinh trên xe.
 *       Không cần nhập dữ liệu trong body — chỉ cần chọn `?state=waiting` hoặc `?state=done` trên URL.
 *     tags: [Tai xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: xeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của xe cần cập nhật trạng thái
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *           enum: [waiting, done]
 *           example: waiting
 *         description: Trạng thái mới cần cập nhật cho toàn bộ học sinh
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã cập nhật trạng thái waiting cho toàn bộ học sinh trên xe."
 *                 updatedCount:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Trạng thái không hợp lệ hoặc thiếu tham số state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vui lòng cung cấp state hợp lệ (waiting hoặc done)"
 *       403:
 *         description: Không có quyền cập nhật xe này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bạn không có quyền thay đổi trạng thái của xe này"
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
 *         description: Lỗi máy chủ khi cập nhật trạng thái học sinh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ khi cập nhật trạng thái học sinh"
 */

/**
 * @swagger
 * /taixe/lich-trinh:
 *   get:
 *     summary: Lấy lịch trình xe của tài xế hiện tại
 *     tags: [Tai xe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy lịch trình xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy lịch trình xe thành công
 *                 xe_id:
 *                   type: string
 *                 code_xe:
 *                   type: string
 *                   example: XE0001
 *                 tuyen:
 *                   type: string
 *                   example: Tuyến A
 *                 lich_trinh:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       diadiem:
 *                         type: string
 *                         example: "123 Nguyễn Trãi"
 *                       hoten_hocsinh:
 *                         type: string
 *                         example: "Nguyễn Văn A"
 *                       sdt_hocsinh:
 *                         type: string
 *                         example: "0987654321"
 *                       phu_huynh:
 *                         type: object
 *                         properties:
 *                           hoten:
 *                             type: string
 *                             example: "Phạm Thị B"
 *                           sdt:
 *                             type: string
 *                             example: "0909999999"
 *                           quanhe:
 *                             type: string
 *                             example: "Mẹ"
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy xe
 *       500:
 *         description: Lỗi server
 */
