const axios = require("axios");
const {
  createPayment,
  findPaymentByOrderId,
  findPaymentById,
} = require("../models/data");

/**
 * Process payment for an order
 * POST /api/payments
 * Protected route
 */
const processPayment = async (req, res) => {
  const { order_id, payment_method } = req.body;

  // Validation
  if (!order_id) {
    return res.status(400).json({ error: "order_id is required" });
  }

  if (!payment_method || !["card", "cash", "online"].includes(payment_method)) {
    return res.status(400).json({
      error:
        "payment_method is required and must be one of: card, cash, online",
    });
  }

  try {
    // Get authorization token from request
    const token = req.headers.authorization?.split(" ")[1];

    // Fetch order from Order Service
    const orderResponse = await axios.get(
      `http://localhost:8004/api/orders/${order_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const order = orderResponse.data.order;

    // Validate order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Validate order status is pending
    if (order.status !== "pending") {
      return res.status(400).json({
        error: `Order status is ${order.status}. Payment can only be processed for pending orders.`,
      });
    }

    // Get amount from order
    const amount = order.total_price;

    // Check if payment already exists for this order
    const existingPayment = findPaymentByOrderId(order_id);
    if (existingPayment) {
      return res.status(409).json({
        error: "Payment already exists for this order",
        payment: existingPayment,
      });
    }

    // Create payment with completed status
    const payment = createPayment(
      order_id,
      amount,
      payment_method,
      "completed",
    );

    return res.status(201).json({
      success: true,
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    // Check if error is from axios
    if (error.response) {
      // Order service returned an error
      return res.status(error.response.status).json({
        error:
          error.response.data?.error ||
          "Failed to fetch order from Order Service",
      });
    } else if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Order Service is unavailable",
      });
    } else {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
};

/**
 * Get payment by order ID
 * GET /api/payments/:order_id
 * Protected route
 */
const getPaymentByOrderId = (req, res) => {
  const { order_id } = req.params;
  const orderId = parseInt(order_id);

  const payment = findPaymentByOrderId(orderId);

  if (!payment) {
    return res.status(404).json({ error: "Payment not found for this order" });
  }

  return res.status(200).json({
    success: true,
    payment,
  });
};

module.exports = {
  processPayment,
  getPaymentByOrderId,
};
