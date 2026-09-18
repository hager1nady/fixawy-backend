const express = require("express");
const callRecordingUpload = require("../../middlewares/callRecordingUpload");

const router = express.Router();

const {
    createCallRecord,
    getCallRecordById,
    getAllCallRecords,
} = require("./callRecord.controller");

/**
 * @swagger
 * tags:
 *   name: Call Center
 *   description: Call center and call recording management
 */

/**
 * @swagger
 * /api/call-center/calls:
 *   post:
 *     summary: Create a call record
 *     tags: [Call Center]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - callerType
 *               - receiverType
 *               - callType
 *               - startedAt
 *               - recording
 *             properties:
 *               callerType:
 *                 type: string
 *                 example: CLIENT
 *               callerId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               receiverType:
 *                 type: string
 *                 example: CALL_CENTER
 *               receiverId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               department:
 *                 type: string
 *                 enum:
 *                   - SUPPORT
 *                   - COMPLAINTS
 *                   - FINANCE
 *                   - TECHNICAL
 *                 example: SUPPORT
 *               callType:
 *                 type: string
 *                 example: FOLLOW_UP
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-17T15:00:00.000Z"
 *               endedAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               durationSeconds:
 *                 type: integer
 *                 nullable: true
 *                 example: 600
 *               recording:
 *                 type: string
 *                 format: binary
 *                 description: Audio recording of the call
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Customer confirmed that the issue was resolved."
 *               orderId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "06003c82-48bf-4442-98bb-7c0fa5ee64b2"
 *     responses:
 *       201:
 *         description: Call record created successfully
 *       400:
 *         description: Invalid request
 */
router.post(
    "/calls",
    callRecordingUpload.single("recording"),
    createCallRecord
);

/**
 * @swagger
 * /api/call-center/calls:
 *   get:
 *     summary: Get all call records
 *     tags: [Call Center]
 *     responses:
 *       200:
 *         description: Call records retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/calls", getAllCallRecords);

/**
 * @swagger
 * /api/call-center/calls/{id}:
 *   get:
 *     summary: Get a call record by ID
 *     tags: [Call Center]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Call record ID
 *     responses:
 *       200:
 *         description: Call record retrieved successfully
 *       404:
 *         description: Call record not found
 */
router.get("/calls/:id", getCallRecordById);

module.exports = router;