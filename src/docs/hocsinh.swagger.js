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

/**
 * @swagger
 * /hocsinh/profile/{mahs}:
 *   get:
 *     summary: Lấy thông tin hồ sơ học sinh theo mã học sinh
 *     tags: [Học sinh]
 *     parameters:
 *       - in: path
 *         name: mahs
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã học sinh cần lấy thông tin
 *     responses:
 *       200:
 *         description: Thông tin chi tiết hồ sơ học sinh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 _id: "671f0eac80762b8c5f143b96"
 *                 email: "hocsinh1@example.com"
 *                 role: "hoc_sinh"
 *                 profile:
 *                   hoten: "Nguyễn Văn A"
 *                   ngaysinh: "2010-01-01"
 *                   gioitinh: "Nam"
 *                   sdt: "0912345678"
 *                 hoc_sinh_info:
 *                   mahs: "HS001"
 *                   lop: "5A"
 *                   phu_huynh:
 *                     hoten: "Nguyễn Văn B"
 *                     sdt: "0987654321"
 *                     quanhe: "Bố"
 *                   diadiem_don_tra: "123 Lê Lợi, TP.HCM"
 *                   state: "done"
 *                   state_time: "2025-10-28T08:00:00.000Z"
 *       404:
 *         description: Không tìm thấy học sinh
 *       500:
 *         description: Lỗi máy chủ
 */
