const express = require("express");
const {
  processPayment,
  getPaymentByOrderId,
} = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Process payment for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - payment_method
 *             properties:
 *               order_id:
 *                 type: number
 *                 example: 1
 *               payment_method:
 *                 type: string
 *                 enum: [card, cash, online]
 *                 example: card
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     payment_method:
 *                       type: string
 *                     status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Bad request or order not pending
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Order not found
 *       409:
 *         description: Payment already exists for this order
 *       503:
 *         description: Order Service unavailable
 */
router.post("/", verifyToken, processPayment);

/**
 * @swagger
 * /api/payments/{order_id}:
 *   get:
 *     summary: Get payment by order ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: number
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Payment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     payment_method:
 *                       type: string
 *                     status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Payment not found for this order
 */
router.get("/:order_id", verifyToken, getPaymentByOrderId);

module.exports = router;
