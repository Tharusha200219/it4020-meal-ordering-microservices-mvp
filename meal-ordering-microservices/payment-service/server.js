require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 8005;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Routes
app.use("/api/payments", paymentRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint checking if Payment service is alive
 *     responses:
 *       200:
 *         description: Welcome message
 */
app.get("/", (req, res) => {
  res.json({ message: "Payment Service is up and running" });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Healthcheck endpoint
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Payment Service is running" });
});

// Swagger definitions for Payment Routes
/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - order_id
 *         - amount
 *         - payment_method
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the payment
 *         order_id:
 *           type: integer
 *           description: The ID of the associated order
 *         amount:
 *           type: number
 *           description: Amount to be paid
 *         payment_method:
 *           type: string
 *           description: Mmethod of payment (card, cash, online)
 *         status:
 *           type: string
 *           description: Current payment status (pending, completed, failed)
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Returns the list of all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *   post:
 *     summary: Process a new payment based on an order id
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
 *                 type: integer
 *                 description: Order ID fetched to determine amount
 *               payment_method:
 *                 type: string
 *                 enum: [card, cash, online]
 *     responses:
 *       201:
 *         description: The payment was successfully processed
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
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error or Order Service unavailable
 */

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The payment id
 *     responses:
 *       200:
 *         description: Payment data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *   put:
 *     summary: Update payment details
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The payment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *               payment_method:
 *                 type: string
 *                 enum: [card, cash, online]
 *     responses:
 *       200:
 *         description: The payment was successfully updated
 *       404:
 *         description: Payment not found
 *   delete:
 *     summary: Remove the payment by id
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The payment id
 *     responses:
 *       200:
 *         description: The payment was deleted
 *       404:
 *         description: The payment was not found
 */

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
