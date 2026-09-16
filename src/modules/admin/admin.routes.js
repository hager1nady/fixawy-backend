const express = require("express");
const {
    loginAdmin,
    getAdminProfile,
    getAllClients,
    getAllTechnicians,
    getTechnicianById,
    activateTechnician,
    disableTechnician,
    getOrdersPerDay,
    getMostRequestedCategories,
    getAverageOrderTimes,
    getMostActiveCities,
    getCancellationRate,
    getCustomerSatisfaction,
    getProfitValue,
    getAllOrders,
    getAllComplaints,
    updateComplaint,
} = require("./admin.controller");

const adminMiddleware = require("../../middlewares/admin.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and management
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@fixawy.com
 *               password:
 *                 type: string
 *                 example: Admin@123456
 *     responses:
 *       200:
 *         description: Admin login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Admin account is not active
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginAdmin);

/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     summary: Get admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.get("/profile", adminMiddleware, getAdminProfile);

/**
 * @swagger
 * /api/admin/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clients retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/clients", adminMiddleware, getAllClients);

/**
 * @swagger
 * /api/admin/technicians:
 *   get:
 *     summary: Get all technicians
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technicians retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/technicians", adminMiddleware, getAllTechnicians);

/**
 * @swagger
 * /api/admin/technicians/{id}:
 *   get:
 *     summary: Get technician details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Technician ID
 *     responses:
 *       200:
 *         description: Technician retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Technician not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/technicians/:id",
    adminMiddleware,
    getTechnicianById
);

/**
 * @swagger
 * /api/admin/technicians/{id}/activate:
 *   put:
 *     summary: Activate technician
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Technician ID
 *     responses:
 *       200:
 *         description: Technician activated successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Technician not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/technicians/:id/activate",
    adminMiddleware,
    activateTechnician
);

/**
 * @swagger
 * /api/admin/reports/orders-per-day:
 *   get:
 *     summary: Get orders per day
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders per day retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
    "/reports/orders-per-day",
    adminMiddleware,
    getOrdersPerDay
);

/**
 * @swagger
 * /api/admin/reports/most-requested-categories:
 *   get:
 *     summary: Get most requested categories and subcategories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most requested categories retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
    "/reports/most-requested-categories",
    adminMiddleware,
    getMostRequestedCategories
);

/**
 * @swagger
 * /api/admin/reports/cancellation-rate:
 *   get:
 *     summary: Get order cancellation rate
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cancellation rate retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
    "/reports/cancellation-rate",
    adminMiddleware,
    getCancellationRate
);

/**
 * @swagger
 * /api/admin/reports/customer-satisfaction:
 *   get:
 *     summary: Get customer satisfaction
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer satisfaction retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
    "/reports/customer-satisfaction",
    adminMiddleware,
    getCustomerSatisfaction
);

/**
 * @swagger
 * /api/admin/reports/profit-value:
 *   get:
 *     summary: Get profit value
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profit value retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
    "/reports/profit-value",
    adminMiddleware,
    getProfitValue
);

 /**
 * @swagger
 * /api/admin/reports/average-order-times:
 *   get:
 *     summary: Get average arrival and execution times
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Average order times retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
    "/reports/average-order-times",
    adminMiddleware,
    getAverageOrderTimes
);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/orders", adminMiddleware, getAllOrders);

/**
 * @swagger
 * /api/admin/reports/most-active-cities:
 *   get:
 *     summary: Get most active cities
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most active cities retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
    "/reports/most-active-cities",
    adminMiddleware,
    getMostActiveCities
);

/**
 * @swagger
 * /api/admin/technicians/{id}/disable:
 *   put:
 *     summary: Disable technician
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Technician ID
 *     responses:
 *       200:
 *         description: Technician disabled successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Technician not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/technicians/:id/disable",
    adminMiddleware,
    disableTechnician
);

/**
 * @swagger
 * /api/admin/complaints:
 *   get:
 *     summary: Get all complaints
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaints retrieved successfully
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/complaints", adminMiddleware, getAllComplaints);

/**
 * @swagger
 * /api/admin/complaints/{id}:
 *   put:
 *     summary: Update a complaint
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - complaintStatus
 *               - finalDecision
 *             properties:
 *               complaintStatus:
 *                 type: string
 *                 example: RESOLVED
 *               finalDecision:
 *                 type: string
 *                 example: Complaint reviewed and resolved.
 *     responses:
 *       200:
 *         description: Complaint updated successfully
 *       404:
 *         description: Complaint not found
 *       401:
 *         description: Invalid or missing authorization token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.put(
    "/complaints/:id",
    adminMiddleware,
    updateComplaint
);

module.exports = router;