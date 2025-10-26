/**
 * @swagger
 * tags:
 *   name: Học sinh
 *   description: Hoc sinh
 */

/**
 * @swagger
 * /hocsinh/state:
 *   patch:
 *     summary: Học sinh cập nhật trạng thái sang "on_bus"
 *     tags: [Học sinh]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Chỉ học sinh mới có thể thực hiện hành động này
 *       500:
 *         description: Lỗi server
 */
