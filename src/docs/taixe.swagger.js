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
