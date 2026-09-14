const express = require("express");

const paymentController = require("./payment.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /api/payments/{orderId}/calculate:
 *   get:
 *     summary: Calculate payment for a completed order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Completed order ID
 *     responses:
 *       200:
 *         description: Payment calculation completed successfully
 *       400:
 *         description: Completed order not found or payment calculation failed
 *       401:
 *         description: Authorization token is missing or invalid
 */
router.get(
    "/:orderId/calculate",
    authMiddleware,
    paymentController.calculatePayment
);

/**
 * @swagger
 * /api/payments/{orderId}:
 *   post:
 *     summary: Create a payment for a completed order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Completed order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - transactionId
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - BANK_TRANSFER
 *                   - FAWRY
 *                   - INSTAPAY
 *                   - VODAFONE_CASH
 *                   - ETISALAT_CASH
 *                   - ORANGE_CASH
 *                 example: INSTAPAY
 *               transactionId:
 *                 type: string
 *                 example: TXN-001
 *               referenceNumber:
 *                 type: string
 *                 nullable: true
 *                 example: REF-001
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Payment creation failed
 *       401:
 *         description: Authorization token is missing or invalid
 */
router.post(
    "/:orderId",
    authMiddleware,
    paymentController.createPayment
);

module.exports = router;