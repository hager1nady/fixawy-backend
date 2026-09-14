const express = require("express");

const catalogController = require("./catalog.controller");

const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new catalog service
 *     tags:
 *       - Catalog Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceName
 *               - mainCategory
 *               - subcategory
 *               - serviceDescription
 *             properties:
 *               serviceName:
 *                 type: string
 *                 example: Air Conditioner Repair
 *               mainCategory:
 *                 type: string
 *                 example: Home Maintenance
 *               subcategory:
 *                 type: string
 *                 example: Air Conditioning
 *               serviceDescription:
 *                 type: string
 *                 example: AC is not cooling properly
 *               illustrativeImage:
 *                 type: string
 *                 example: https://example.com/ac.jpg
 *               initialPrice:
 *                 type: number
 *                 example: 200
 *               pricingMethod:
 *                 type: string
 *                 example: FIXED
 *               expectedDuration:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Invalid service data
 */
router.post("/", catalogController.createService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all catalog services
 *     tags:
 *       - Catalog Services
 *     responses:
 *       200:
 *         description: List of catalog services
 */
router.get("/", catalogController.getAllServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a catalog service by ID
 *     tags:
 *       - Catalog Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service found
 *       404:
 *         description: Service not found
 */
router.get("/:id", catalogController.getServiceById);

module.exports = router;