const express = require("express");
const clientController = require("./client.controller");
const upload = require("../../middlewares/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/clients/register:
 *   post:
 *     summary: Register a new client
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - mobileNumber
 *               - password
 *               - nationalId
 *               - nationalIdImage
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Ahmed Ali
 *               mobileNumber:
 *                 type: string
 *                 example: "01000000001"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Test@123456
 *               nationalId:
 *                 type: string
 *                 example: "12345678901234"
 *               nationalIdImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Client account created successfully
 *       400:
 *         description: Invalid data or mobile number already registered
 */
router.post(
    "/register",
    upload.single("nationalIdImage"),
    clientController.registerClient
);


/**
 * @swagger
 * /api/clients/login:
 *   post:
 *     summary: Login client
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *               - password
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 example: "01000000001"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Test@123456
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid mobile number or password
 */
router.post(
    "/login",
    clientController.loginClient
);

module.exports = router;