const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const followUpController = require("./followUp.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Follow-ups
 *   description: Order follow-up management
 */

/**
 * @swagger
 * /api/follow-ups/{orderId}:
 *   post:
 *     summary: Create a follow-up for an order
 *     tags: [Follow-ups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduledAt
 *             properties:
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-16T12:00:00.000Z"
 *     responses:
 *       201:
 *         description: Follow-up created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authorization token is required or invalid
 */
router.post(
    "/:orderId",
    authMiddleware,
    followUpController.createFollowUp
);

module.exports = router;