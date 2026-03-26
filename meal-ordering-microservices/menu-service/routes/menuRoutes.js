const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const menuController = require('../controllers/menuController');

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu item (Protected)
 *     tags: [Menus]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant_id: { type: integer, example: 1 }
 *               name: { type: string, example: "Margherita Pizza" }
 *               description: { type: string, example: "Classic pizza with fresh basil" }
 *               price: { type: number, example: 1250 }
 *     responses:
 *       201: { description: Menu item created successfully }
 */
router.post('/', auth, menuController.createMenuItem);

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Get all menus or filter by restaurant_id (Protected)
 *     tags: [Menus]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurant_id
 *         schema: { type: integer }
 *         description: Filter menus by restaurant ID
 *     responses:
 *       200: { description: List of menu items }
 */
router.get('/', auth, menuController.getMenus);

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Get one menu item by ID (Protected)
 *     tags: [Menus]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Menu item details }
 *       404: { description: Menu not found }
 */
router.get('/:id', auth, menuController.getMenuById);

/**
 * @swagger
 * /api/menus/{id}:
 *   put:
 *     summary: Update a menu item (Protected)
 *     tags: [Menus]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant_id: { type: integer }
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *     responses:
 *       200: { description: Menu updated successfully }
 */
router.put('/:id', auth, menuController.updateMenuItem);

/**
 * @swagger
 * /api/menus/{id}:
 *   delete:
 *     summary: Delete a menu item (Protected)
 *     tags: [Menus]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Menu deleted successfully }
 *       404: { description: Menu not found }
 */
router.delete('/:id', auth, menuController.deleteMenuItem);

module.exports = router;