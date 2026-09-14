const express = require("express");

const complaintController = require("./complaint.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaints and dispute management
 */

/**
 * @swagger
 * /api/complaints/{orderId}:
 *   post:
 *     summary: Submit a complaint for an order
 *     tags:
 *       - Complaints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Technician arrived late and the issue was not resolved
 *               attachments:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/complaint-image.jpg
 *     responses:
 *       201:
 *         description: Complaint submitted successfully
 *       400:
 *         description: Invalid request or unauthorized complaint
 *       401:
 *         description: Authorization token is missing or invalid
 */
router.post(
    "/:orderId",
    authMiddleware,
    complaintController.createComplaint
);

module.exports = router;