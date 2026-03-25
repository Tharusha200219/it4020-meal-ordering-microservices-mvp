const express = require("express");
const axios = require("axios");

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 */

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of menu items
 */

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item details
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - items
 *               - total_price
 *             properties:
 *               user_id:
 *                 type: integer
 *               items:
 *                 type: array
 *               total_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order details
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Process payment
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
 *               payment_method:
 *                 type: string
 *                 enum: [card, cash, online]
 *     responses:
 *       201:
 *         description: Payment processed
 */

/**
 * @swagger
 * /api/payments/{order_id}:
 *   get:
 *     summary: Get payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment details
 */

// Helper function to proxy requests using axios
async function proxyRequest(req, res, baseURL) {
  try {
    const url = baseURL + req.url;
    const config = {
      method: req.method,
      url: url,
      headers: { ...req.headers },
      data: req.body && Object.keys(req.body).length > 0 ? req.body : undefined,
      validateStatus: () => true,
      timeout: 10000,
    };

    delete config.headers.host;

    const response = await axios(config);
    Object.keys(response.headers).forEach((key) => {
      if (key !== "connection" && key !== "content-encoding") {
        res.set(key, response.headers[key]);
      }
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res
      .status(503)
      .json({ error: "Service unavailable", details: error.message });
  }
}

// API routes proxy
router.all("/api/users/:path*", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8001");
});

router.all("/api/restaurants/:path*", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8002");
});

router.all("/api/menus/:path*", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8003");
});

router.all("/api/orders/:path*", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8004");
});

router.all("/api/payments/:path*", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8005");
});

// Fallback for direct /api/users, /api/restaurants etc. without trailing path
router.all("/api/users", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8001");
});

router.all("/api/restaurants", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8002");
});

router.all("/api/menus", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8003");
});

router.all("/api/orders", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8004");
});

router.all("/api/payments", async (req, res) => {
  await proxyRequest(req, res, "http://localhost:8005");
});

module.exports = router;
