
const express = require("express");

const orderController = require("./order.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const orderUpload = require("../../middlewares/orderUpload.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/orders/technician-orders:
 *   get:
 *     summary: Get orders assigned to the authenticated technician
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technician orders retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only technicians can view their orders
 */
router.get(
    "/technician-orders",
    authMiddleware,
    orderController.getTechnicianOrders
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get orders for the authenticated client
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client orders retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only clients can view their orders
 */
router.get(
    "/my-orders",
    authMiddleware,
    orderController.getClientOrders
);



/**
 * @swagger
 * /api/orders/search/{orderCode}:
 *   get:
 *     summary: Search for an order by its code
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique order code, for example ORD-3EE4D421
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found or access not authorized
 */
router.get(
    "/search/:orderCode",
    authMiddleware,
    orderController.getOrderByCode
);



/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
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
 *         description: Order details retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found or access not authorized
 */
router.get(
    "/:id",
    authMiddleware,
    orderController.getOrderDetails
);


/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new service order
 *     description: |
 *       Creates a new service order for the authenticated client.
 *       The client ID is taken from the JWT token and does not need to be sent in the request body.
 *       Either a problem image or a problem video is required.
 *       The client may optionally select a specific technician.
 *       If no technician is selected, the system assigns a suitable technician automatically.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
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
 *               problemImage:
 *                 type: string
 *                 format: binary
 *                 description: Image showing the problem
 *               problemVideo:
 *                 type: string
 *                 format: binary
 *                 description: Video showing the problem
 *               serviceLocation:
 *                 type: string
 *                 description: Location where the service will be performed
 *                 example: Minya, Egypt
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the selected catalog service
 *                 example: 550e8400-e29b-41d4-a716-446655440001
 *               technicianId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional ID of the technician selected by the client
 *                 example: 1ac2c5b5-1e69-479d-a312-c62c6c6101a6
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request data, missing problem media, or invalid selected technician
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Service or selected technician not found
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
