import { Router } from "express";
import { authenticate, adminOnly } from "../middleware/authMiddleware";
import { bulkCreate, listSlots, updateSlot, deleteSlot } from "../controllers/slotController";

const router = Router();

/**
 * @swagger
 * /bulk:
 *   post:
 *     summary: Bulk create parking slots
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slots
 *             properties:
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     slotNumber:
 *                       type: string
 *                     isAvailable:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Parking slots created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 slotIds:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       403:
 *         description: Forbidden, admin access required
 */
router.post("/bulk", authenticate, adminOnly, bulkCreate);

/**
 * @swagger
 * /:
 *   get:
 *     summary: List all parking slots
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parking slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   slotNumber:
 *                     type: string
 *                   isAvailable:
 *                     type: boolean
 *       401:
 *         description: Unauthorized, JWT token required
 *       403:
 *         description: Forbidden, admin access required
 */
router.get("/", authenticate, adminOnly, listSlots);

/**
 * @swagger
 * /update/{id}:
 *   patch:
 *     summary: Update a parking slot
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking slot to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slotNumber:
 *                 type: string
 *                 description: The new slot number
 *               isAvailable:
 *                 type: boolean
 *                 description: Availability status of the slot
 *     responses:
 *       200:
 *         description: Parking slot updated successfully
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
 *         description: Slot not found
 */
router.patch("/update/:id", authenticate, adminOnly, updateSlot);

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a parking slot
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking slot to delete
 *     responses:
 *       200:
 *         description: Parking slot deleted successfully
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
 *         description: Slot not found
 */
router.delete("/delete/:id", authenticate, adminOnly, deleteSlot);

export default router;