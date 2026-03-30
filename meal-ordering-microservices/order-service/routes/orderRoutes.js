// order-service/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (orchestrates User, Restaurant, Menu)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant_id: { type: number, example: 1 }
 *               items: 
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties: 
 *                     menu_id: { type: number }
 *                     qty: { type: number }
 *     responses:
 *       201: { description: Order created successfully }
 * 
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: List of orders }
 * 
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: Order details }
 * 
 *   put:
 *     summary: Update order (status OR change items / restaurant)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: number }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, delivered]
 *               restaurant_id:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menu_id: { type: number }
 *                     qty: { type: number }
 *     responses:
 *       200: { description: Order updated successfully }
 * 
 *   delete:
 *     summary: Cancel pending order
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: Order cancelled successfully }
 */

router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getMyOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.put('/:id', authenticateToken, orderController.updateOrder);   // ← works with new handler
router.delete('/:id', authenticateToken, orderController.cancelOrder);

module.exports = router;