import { Router } from "express";
import { authenticate, adminOnly } from "../middleware/authMiddleware";
import { createRequest, approveRequest, rejectRequest, listRequests, handleExit, getRequest, deleteRequest } from "../controllers/requestController";

const router = Router();

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new parking request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - slotId
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 description: The ID of the vehicle for the request
 *               slotId:
 *                 type: string
 *                 description: The ID of the parking slot requested
 *     responses:
 *       201:
 *         description: Parking request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 requestId:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       400:
 *         description: Invalid input
 */
router.post("/", authenticate, createRequest);

/**
 * @swagger
 * /all-requests:
 *   get:
 *     summary: List all parking requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parking requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   vehicleId:
 *                     type: string
 *                   slotId:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized, JWT token required
 */
router.get("/all-requests", authenticate, listRequests);

/**
 * @swagger
 * /get-request/{id}:
 *   get:
 *     summary: Get a specific parking request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking request to retrieve
 *     responses:
 *       200:
 *         description: Parking request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 vehicleId:
 *                   type: string
 *                 slotId:
 *                   type: string
 *                 status:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       404:
 *         description: Request not found
 */
router.get('/get-request/:id', getRequest);

/**
 * @swagger
 * /request/{id}/exit:
 *   patch:
 *     summary: Handle vehicle exit from a parking slot
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking request to handle exit for
 *     responses:
 *       200:
 *         description: Vehicle exit handled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Request not found
 */
router.patch('/request/:id/exit', authenticate, adminOnly, handleExit);

/**
 * @swagger
 * /{id}/approve:
 *   patch:
 *     summary: Approve a parking request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking request to approve
 *     responses:
 *       200:
 *         description: Parking request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Request not found
 */
router.patch("/:id/approve", authenticate, adminOnly, approveRequest);

/**
 * @swagger
 * /{id}/reject:
 *   patch:
 *     summary: Reject a parking request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking request to reject
 *     responses:
 *       200:
 *         description: Parking request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Request not found
 */
router.patch("/:id/reject", authenticate, adminOnly, rejectRequest);

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a parking request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking request to delete
 *     responses:
 *       200:
 *         description: Parking request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       403:
 *         description: Forbidden, not allowed to delete this request
 *       404:
 *         description: Parking request not found
 */
router.delete("/delete/:id", deleteRequest)

export default router;