import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createVehicle, listVehicles, updateVehicle, deleteVehicle } from "../controllers/vehicleController";

const router = Router();

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licensePlate
 *               - model
 *             properties:
 *               licensePlate:
 *                 type: string
 *                 description: The license plate of the vehicle
 *               model:
 *                 type: string
 *                 description: The model of the vehicle
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 vehicleId:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       400:
 *         description: Invalid input
 */
router.post("/", authenticate, createVehicle);

/**
 * @swagger
 * /all-vehicles:
 *   get:
 *     summary: List all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   licensePlate:
 *                     type: string
 *                   model:
 *                     type: string
 *       401:
 *         description: Unauthorized, JWT token required
 */
router.get("/all-vehicles", authenticate, listVehicles);

/**
 * @swagger
 * /update/{id}:
 *   patch:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *                 description: The updated license plate of the vehicle
 *               model:
 *                 type: string
 *                 description: The updated model of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       404:
 *         description: Vehicle not found
 */
router.patch("/update/:id", authenticate, updateVehicle);

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vehicle to delete
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       404:
 *         description: Vehicle not found
 */
router.delete("/delete/:id", authenticate, deleteVehicle);

export default router;