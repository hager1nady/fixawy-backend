const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const assignmentController = require("./assignment.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Technician assignment management
 */

/**
 * @swagger
 * /api/assignments/{id}/accept:
 *   post:
 *     summary: Accept an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment accepted successfully
 *       400:
 *         description: Assignment cannot be accepted
 *       401:
 *         description: Authentication required
 */
router.post(
    "/:id/accept",
    authMiddleware,
    assignmentController.acceptAssignment
);

/**
 * @swagger
 * /api/assignments/{id}/reject:
 *   post:
 *     summary: Reject an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment rejected successfully
 *       400:
 *         description: Assignment cannot be rejected
 *       401:
 *         description: Authentication required
 */
router.post(
    "/:id/reject",
    authMiddleware,
    assignmentController.rejectAssignment
);

module.exports = router;