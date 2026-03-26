const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Restaurants
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
 *                 example: Pizza Hut
 *               location:
 *                 type: string
 *                 example: Colombo
 *               cuisine:
 *                 type: string
 *                 example: Italian
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', auth, createRestaurant);

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Restaurants
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get('/', auth, getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Restaurants
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
router.get('/:id', auth, getRestaurantById);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update restaurant
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Restaurants
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
 *                 example: Pizza Hut Updated
 *               location:
 *                 type: string
 *                 example: Kandy
 *               cuisine:
 *                 type: string
 *                 example: Italian
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put('/:id', auth, updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Restaurants
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
router.delete('/:id', auth, deleteRestaurant);

module.exports = router;