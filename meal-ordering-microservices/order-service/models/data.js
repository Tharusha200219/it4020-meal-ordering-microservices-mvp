// order-service/models/data.js
let orders = [];
let currentId = 1;

const getAllOrders = () => orders;
const getOrderById = (id) => orders.find(o => o.id === parseInt(id));
const getOrdersByUserId = (userId) => orders.filter(o => o.user_id === parseInt(userId));

const saveOrder = (orderData) => {
  const newOrder = {
    id: currentId++,
    ...orderData,
    created_at: new Date().toISOString()
  };
  orders.push(newOrder);
  return newOrder;
};

const updateOrder = (id, updateData) => {
  const order = orders.find(o => o.id === parseInt(id));
  if (!order) return null;
  Object.assign(order, updateData);
  return order;
};

const deleteOrder = (id) => {
  const index = orders.findIndex(o => o.id === parseInt(id));
  if (index === -1) return false;
  const order = orders[index];
  if (order.status !== 'pending') return false;
  orders.splice(index, 1);
  return true;
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  saveOrder,
  updateOrder,
  deleteOrder
};