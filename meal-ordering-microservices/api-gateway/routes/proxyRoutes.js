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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       address:
 *                         type: string
 *       401:
 *         description: Missing or invalid token
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
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of restaurants
 *
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - cuisine
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               cuisine:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *//**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               location:
 *                 type: string
 *                 example: Kandy
 *               cuisine:
 *                 type: string
 *                 example: Sri Lankan
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_id
 *               - name
 *               - description
 *               - price
 *             properties:
 *               restaurant_id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all menus or filter by restaurant_id
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurant_id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of menu items
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Get one menu item by ID
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Menu item not found
 *   put:
 *     summary: Update a menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant_id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Menu item not found
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Menu item not found
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
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
 *       201: { description: "Order created successfully" }
 *
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: "List of orders" } }
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *
 *   put:
 *     summary: Update order (status OR change items / restaurant)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *
 *     responses:
 *       200:
 *         description: Order updated successfully
 *
 *   delete:
 *     summary: Cancel a pending order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
    const headers = { ...req.headers };
    delete headers.host;
    delete headers["content-length"];
    delete headers["connection"];
    delete headers["accept-encoding"];

    // FORCE Authorization header (this fixes the issue)
    if (req.headers.authorization || req.headers.Authorization) {
      headers.authorization =
        req.headers.authorization || req.headers.Authorization;
    }

    const config = {
      method: req.method,
      url: url,
      headers: headers,
      data: ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
        ? req.body
        : undefined,
      validateStatus: () => true,
      timeout: 10000,
    };

    // For requests with body (POST, PUT, PATCH), include data
    if (
      req.method !== "GET" &&
      req.method !== "HEAD" &&
      req.method !== "DELETE"
    ) {
      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
        // Ensure content-type is set
        if (!headers["content-type"]) {
          headers["content-type"] = "application/json";
        }
      }
    }

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
