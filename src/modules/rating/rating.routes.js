const express = require("express");

const ratingController = require("./rating.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Mutual rating management
 */

/**
 * @swagger
 * /api/ratings/{orderId}:
 *   post:
 *     summary: Submit a rating for a completed and paid order
 *     tags:
 *       - Ratings
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
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Excellent service
 *               images:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/rating-image.jpg
 *     responses:
 *       201:
 *         description: Rating submitted successfully
 *       400:
 *         description: Invalid rating, unauthorized user, unpaid order, or duplicate rating
 *       401:
 *         description: Authorization token is missing or invalid
 */
router.post(
    "/:orderId",
    authMiddleware,
    ratingController.createRating
);

module.exports = router;