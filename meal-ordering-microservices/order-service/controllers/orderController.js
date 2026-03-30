// order-service/controllers/orderController.js
const axios = require('axios');
const { 
  saveOrder, 
  getOrderById, 
  getOrdersByUserId, 
  updateOrder, 
  deleteOrder 
} = require('../models/data');

const USER_SERVICE_URL = 'http://localhost:8001/api/users';
const RESTAURANT_SERVICE_URL = 'http://localhost:8002/api/restaurants';
const MENU_SERVICE_URL = 'http://localhost:8003/api/menus';

const getAuthHeader = (req) => ({
  headers: { Authorization: req.headers.authorization }
});

const createOrder = async (req, res) => {
  try {
    const { restaurant_id, items } = req.body;
    const user_id = req.user.id;

    if (!restaurant_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'restaurant_id and items array are required' });
    }

    await axios.get(`${USER_SERVICE_URL}/${user_id}`, getAuthHeader(req));
    await axios.get(`${RESTAURANT_SERVICE_URL}/${restaurant_id}`, getAuthHeader(req));

    let total_price = 0;
    const orderItems = [];

    for (const item of items) {
      const menuRes = await axios.get(`${MENU_SERVICE_URL}/${item.menu_id}`, getAuthHeader(req));
      const menu = menuRes.data;

      if (menu.restaurant_id !== parseInt(restaurant_id)) {
        return res.status(400).json({ 
          message: `Menu item ${item.menu_id} does not belong to restaurant ${restaurant_id}` 
        });
      }

      const itemTotal = menu.price * item.qty;
      total_price += itemTotal;

      orderItems.push({
        menu_id: menu.id,
        name: menu.name,
        price: menu.price,
        qty: item.qty,
        item_total: itemTotal
      });
    }

    const newOrder = saveOrder({
      user_id,
      restaurant_id,
      items: orderItems,
      total_price,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Order creation error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: error.response.data.message || 'External service error' 
      });
    }
    res.status(500).json({ message: 'Failed to create order' });
  }
};

const getMyOrders = (req, res) => {
  const user_id = req.user.id;
  const myOrders = getOrdersByUserId(user_id);
  res.json(myOrders);
};

const getOrderByIdCtrl = (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

// ==================== UPDATED PUT LOGIC (renamed to avoid conflict) ====================
const updateOrderHandler = async (req, res) => {
  const orderId = req.params.id;
  const { status, restaurant_id, items } = req.body;
  const existingOrder = getOrderById(orderId);

  if (!existingOrder) return res.status(404).json({ message: 'Order not found' });
  if (existingOrder.user_id !== req.user.id) return res.status(403).json({ message: 'Not your order' });

  let updatedData = {};

  // Case 1: Simple status update
  if (status && !restaurant_id && !items) {
    const allowedStatuses = ['confirmed', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status can only be changed to confirmed or delivered' });
    }
    updatedData.status = status;
  } 
  // Case 2: Full update (change restaurant or items)
  else if (restaurant_id || items) {
    const newRestaurantId = restaurant_id || existingOrder.restaurant_id;
    const newItems = items || existingOrder.items.map(i => ({ menu_id: i.menu_id, qty: i.qty }));

    await axios.get(`${USER_SERVICE_URL}/${req.user.id}`, getAuthHeader(req));
    await axios.get(`${RESTAURANT_SERVICE_URL}/${newRestaurantId}`, getAuthHeader(req));

    let total_price = 0;
    const orderItems = [];

    for (const item of newItems) {
      const menuRes = await axios.get(`${MENU_SERVICE_URL}/${item.menu_id}`, getAuthHeader(req));
      const menu = menuRes.data;

      if (menu.restaurant_id !== parseInt(newRestaurantId)) {
        return res.status(400).json({ 
          message: `Menu item ${item.menu_id} does not belong to restaurant ${newRestaurantId}` 
        });
      }

      const itemTotal = menu.price * item.qty;
      total_price += itemTotal;

      orderItems.push({
        menu_id: menu.id,
        name: menu.name,
        price: menu.price,
        qty: item.qty,
        item_total: itemTotal
      });
    }

    updatedData = {
      restaurant_id: parseInt(newRestaurantId),
      items: orderItems,
      total_price
    };
  } 
  else {
    return res.status(400).json({ message: 'Provide status or (restaurant_id + items)' });
  }

  const updatedOrder = updateOrder(orderId, updatedData);
  res.json({ 
    message: 'Order updated successfully', 
    order: updatedOrder 
  });
};

const cancelOrder = (req, res) => {
  const order = getOrderById(req.params.id);

  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user_id !== req.user.id) return res.status(403).json({ message: 'Not your order' });
  if (order.status !== 'pending') {
    return res.status(400).json({ message: 'Only pending orders can be cancelled' });
  }

  const deleted = deleteOrder(req.params.id);
  if (deleted) {
    res.json({ message: 'Order cancelled successfully' });
  } else {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById: getOrderByIdCtrl,
  updateOrder: updateOrderHandler,     // ← renamed internally, exported as updateOrder for routes
  cancelOrder
};