import express from 'express';
import { markAsPaid, getPaymentHistory } from '../controllers/paymentController';
import { authenticate, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /history/{userId}:
 *   get:
 *     summary: Get payment history for a user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch payment history for
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized, JWT token required
 *       404:
 *         description: User not found
 */
router.get('/history/:userId', getPaymentHistory);

/**
 * @swagger
 * /{id}/pay:
 *   patch:
 *     summary: Mark a payment as paid
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to mark as paid
 *     responses:
 *       200:
 *         description: Payment marked as paid successfully
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
 *         description: Payment not found
 */
router.patch('/:id/pay', adminOnly, markAsPaid);

export default router;