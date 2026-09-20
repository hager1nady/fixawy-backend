const express = require("express");

const clientBalanceController = require("./client-balance.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/clients/balance:
 *   get:
 *     summary: Get current client balance
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client balance retrieved successfully
 *       401:
 *         description: Authorization token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get(
    "/balance",
    authMiddleware,
    clientBalanceController.getMyBalance
);

module.exports = router;