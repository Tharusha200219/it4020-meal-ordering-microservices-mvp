// In-memory data store for Order Service
// Array of orders
// Fields: id, user_id, restaurant_id, items, total_price, status, created_at

let orders = [];

// Helper functions (MVP)
const orderModel = {
  getAllOrders: () => orders,
  getOrdersByUserId: (userId) => orders.filter(order => order.user_id === userId),
  getOrderById: (id) => orders.find(order => order.id === parseInt(id)),
  
  createOrder: (orderData) => {
    const newOrder = {
      id: orders.length + 1,
      ...orderData,
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    return newOrder;
  },

  updateOrderStatus: (id, status) => {
    const order = orders.find(o => o.id === parseInt(id));
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }
};

module.exports = { orderModel };
