const axios = require('axios');
const { orderModel } = require('../models/data');
require('dotenv').config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8001/api/users';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:8002/api/restaurants';
const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL || 'http://localhost:8003/api/menus';

// Helper to make authenticated requests
const createAxiosConfig = (token) => {
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const createOrder = async (req, res) => {
  try {
    const { restaurant_id, items } = req.body;
    const user_id = req.user.id; // From JWT
    const token = req.token;     // From JWT Auth middleware

    if (!restaurant_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order structure. Need restaurant_id and items.' });
    }

    const axiosConfig = createAxiosConfig(token);

    // 1. Validate User
    try {
      await axios.get(`${USER_SERVICE_URL}/${user_id}`, axiosConfig);
    } catch (error) {
      return res.status(404).json({ message: 'User verification failed.' });
    }

    // 2. Validate Restaurant
    try {
      await axios.get(`${RESTAURANT_SERVICE_URL}/${restaurant_id}`, axiosConfig);
    } catch (error) {
      return res.status(404).json({ message: 'Restaurant verification failed or not found.' });
    }

    // 3. Validate Menus and calculate total price
    let total_price = 0;
    const orderItems = [];

    for (let item of items) {
      if (!item.menu_id || !item.qty || item.qty <= 0) {
        return res.status(400).json({ message: 'Invalid item data (menu_id, qty required and qty > 0).' });
      }

      try {
        const menuResp = await axios.get(`${MENU_SERVICE_URL}/${item.menu_id}`, axiosConfig);
        const menuData = menuResp.data;

        // Check if menu belongs to the restaurant
        if (menuData.restaurant_id !== restaurant_id) {
          return res.status(400).json({ message: `Menu item ${item.menu_id} does not belong to restaurant ${restaurant_id}.` });
        }

        const itemTotal = menuData.price * item.qty;
        total_price += itemTotal;

        orderItems.push({
          menu_id: menuData.id,
          name: menuData.name,
          qty: item.qty,
          price: menuData.price
        });
      } catch (error) {
        return res.status(404).json({ message: `Menu item ${item.menu_id} verification failed.` });
      }
    }

    // 4. Everything verified, Create Order
    const newOrder = orderModel.createOrder({
      user_id,
      restaurant_id,
      items: orderItems,
      total_price,
      status: 'pending'
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error while creating order.' });
  }
};

const getMyOrders = (req, res) => {
  const user_id = req.user.id;
  const userOrders = orderModel.getOrdersByUserId(user_id);
  res.status(200).json(userOrders);
};

const getOrderById = (req, res) => {
  const { id } = req.params;
  const order = orderModel.getOrderById(id);

  if (!order) {
    return res.status(404).json({ message: `Order ${id} not found.` });
  }

  // Optional: check if the user requesting owns the order (unless it's an internal call)
  
  res.status(200).json(order);
};

// Optional for Payment Service internal use
const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const updatedOrder = orderModel.updateOrderStatus(id, status);
  if (!updatedOrder) {
    return res.status(404).json({ message: `Order ${id} not found.` });
  }

  res.status(200).json(updatedOrder);
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};
