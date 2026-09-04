const express = require("express");

const upload = require("../../middlewares/upload.middleware.js");
const technicianController = require("./technician.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Technicians
 *   description: Technician management
 */

/**
 * @swagger
 * /api/technicians/register:
 *   post:
 *     summary: Register a new technician
 *     tags: [Technicians]
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
 *               - profession
 *               - yearsOfExperience
 *               - workArea
 *               - workingHours
 *               - verificationDocument
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
 *               profession:
 *                 type: string
 *                 example: Plumbing
 *                 enum:
 *                   - Plumbing
 *                   - Electrical
 *                   - Cleaning
 *                   - Installations
 *                   - Carpentry
 *                   - Painting
 *               yearsOfExperience:
 *                 type: integer
 *                 example: 5
 *               workArea:
 *                 type: string
 *                 example: Cairo
 *               workingHours:
 *                 type: string
 *                 example: "09:00 AM - 05:00 PM"
 *               verificationDocument:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Technician account created successfully
 *       400:
 *         description: Invalid data or mobile number already registered
 */
router.post(
    "/register",
    upload.single("verificationDocument"),
    technicianController.registerTechnician
);

 /**
 * @swagger
 * /api/technicians/login:
 *   post:
 *     summary: Login technician
 *     tags: [Technicians]
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
    technicianController.loginTechnician
);

module.exports = router;