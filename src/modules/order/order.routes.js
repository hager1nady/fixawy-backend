const express = require("express");

const orderController = require("./order.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const orderUpload = require("../../middlewares/orderUpload.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new service order
 *     description: |
 *       Creates a new service order for the authenticated client.
 *       The client ID is taken from the JWT token and does not need to be sent in the request body.
 *       Either a problem image or a problem video is required.
 *     tags:
 *       - Orders
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - problemDescription
 *               - serviceLocation
 *               - serviceId
 *             properties:
 *               problemDescription:
 *                 type: string
 *                 description: Description of the client's problem
 *                 example: Water leakage in the kitchen
 *
 *               problemImage:
 *                 type: string
 *                 format: binary
 *                 description: Image showing the problem
 *
 *               problemVideo:
 *                 type: string
 *                 format: binary
 *                 description: Video showing the problem
 *
 *               serviceLocation:
 *                 type: string
 *                 description: Location where the service will be performed
 *                 example: Minya, Egypt
 *
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the selected catalog service
 *                 example: 550e8400-e29b-41d4-a716-446655440001
 *
 *     responses:
 *       201:
 *         description: Order created successfully
 *
 *       400:
 *         description: Invalid request data or missing problem media
 *
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *
 *       404:
 *         description: Service not found
 *
 *       500:
 *         description: Internal server error
 */

router.post(
    "/",
    authMiddleware,
    orderUpload.fields([
        { name: "problemImage", maxCount: 1 },
        { name: "problemVideo", maxCount: 1 },
    ]),
    orderController.createOrder
);

/**
 * @swagger
 * /api/orders/{id}/arrive:
 *   post:
 *     summary: Record technician arrival
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Technician arrival recorded successfully
 *       400:
 *         description: Order cannot be marked as arrived
 *       401:
 *         description: Authentication required
 */
router.post(
    "/:id/arrive",
    authMiddleware,
    orderController.markOrderAsArrived
);
/**
 * @swagger
 * /api/orders/{id}/complete:
 *   post:
 *     summary: Complete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order completed successfully
 *       400:
 *         description: Order cannot be completed
 *       401:
 *         description: Authentication required
 */
router.post(
    "/:id/complete",
    authMiddleware,
    orderController.markOrderAsCompleted
);
/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancellationReason
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 example: Customer is no longer available
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       401:
 *         description: Authentication required
 */
router.post(
    "/:id/cancel",
    authMiddleware,
    orderController.cancelOrder
);

module.exports = router;