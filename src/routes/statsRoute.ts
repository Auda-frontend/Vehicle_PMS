import { Router } from "express";
import { authenticate, adminOnly } from "../middleware/authMiddleware";
import { getStats } from "../controllers/statsController";

const router = Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get parking statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVehicles:
 *                   type: number
 *                 occupiedSlots:
 *                   type: number
 *                 availableSlots:
 *                   type: number
 *       401:
 *         description: Unauthorized, JWT token required
 *       403:
 *         description: Forbidden, admin access required
 */
router.get("/stats", authenticate, adminOnly, getStats);

export default router;