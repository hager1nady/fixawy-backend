const express = require("express");

const router = express.Router();

const {
    createFollowUp,
    completeFollowUp,
} = require("./followUp.controller");

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
 *               - scheduledAt
 *             properties:
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-17T14:00:00.000Z"
 *     responses:
 *       201:
 *         description: Follow-up created successfully
 *       400:
 *         description: Invalid request
 */
router.post("/:orderId", createFollowUp);

/**
 * @swagger
 * /api/follow-ups/{orderId}:
 *   put:
 *     summary: Complete a follow-up for an order
 *     tags: [Follow-ups]
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
 *               - completedAt
 *               - customerSatisfied
 *             properties:
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-17T15:00:00.000Z"
 *               customerSatisfied:
 *                 type: boolean
 *                 example: true
 *               notes:
 *                 type: string
 *                 example: "Customer confirmed that the issue was resolved."
 *     responses:
 *       200:
 *         description: Follow-up completed successfully
 *       400:
 *         description: Invalid request or follow-up not found
 */
router.put("/:orderId", completeFollowUp);

module.exports = router;