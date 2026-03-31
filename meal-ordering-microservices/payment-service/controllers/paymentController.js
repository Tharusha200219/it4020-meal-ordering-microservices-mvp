const axios = require('axios');
const payments = require('../models/data');

// @desc    Process a new payment
// @route   POST /api/payments
const processPayment = async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;

    if (!order_id || !payment_method) {
      return res.status(400).json({ success: false, message: 'order_id and payment_method are required' });
    }

    const validMethods = ['card', 'cash', 'online'];
    if (!validMethods.includes(payment_method)) {
      return res.status(400).json({ success: false, message: 'Invalid payment_method. Allowed: card, cash, online' });
    }

    // Pass the JWT token to the order service
    const config = {
      headers: {
        Authorization: req.headers.authorization,
      },
    };

    let orderResponse;
    try {
      // Axios GET to Order Service
      orderResponse = await axios.get(`http://localhost:8004/api/orders/${order_id}`, config);
    } catch (error) {
       console.error("Error from Order Service:", error.response?.data || error.message);
       if (error.response && error.response.status === 404) {
          return res.status(404).json({ success: false, message: 'Order not found' });
       }
       return res.status(500).json({ success: false, message: 'Could not fetch order from Order Service' });
    }

    const order = orderResponse.data;
    
    // Some responses wrap data in a 'order' object (success/order structure), let's handle both
    const orderData = order.order ? order.order : order;

    // Validate order status
    if (orderData.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot process payment for order with status '${orderData.status}'. Must be 'pending'.` });
    }

    // Determine amount
    const amount = orderData.total_price || 0; 

    // Create payment
    const newPayment = {
      id: payments.length + 1,
      order_id: parseInt(order_id),
      amount: amount,
      payment_method: payment_method,
      status: 'completed', // Status is completed
      created_at: new Date().toISOString()
    };

    payments.push(newPayment);

    // Normally, here we would also update the order status via Order Service (e.g., PUT to change to confirmed)
    
    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment: newPayment
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
const getAllPayments = (req, res) => {
  res.status(200).json({
    success: true,
    count: payments.length,
    payments: payments
  });
};

// @desc    Get one payment by ID
// @route   GET /api/payments/:id
const getPaymentById = (req, res) => {
  const payment = payments.find((p) => p.id === parseInt(req.params.id));

  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  res.status(200).json({
    success: true,
    payment: payment
  });
};

// @desc    Update a payment
// @route   PUT /api/payments/:id
const updatePayment = (req, res) => {
  const paymentIndex = payments.findIndex((p) => p.id === parseInt(req.params.id));

  if (paymentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  const { status, payment_method } = req.body;
  const validStatuses = ['pending', 'completed', 'failed'];
  const validMethods = ['card', 'cash', 'online'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  if (payment_method && !validMethods.includes(payment_method)) {
     return res.status(400).json({ success: false, message: 'Invalid payment_method' });
  }

  payments[paymentIndex] = {
    ...payments[paymentIndex],
    status: status || payments[paymentIndex].status,
    payment_method: payment_method || payments[paymentIndex].payment_method,
    updated_at: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    message: 'Payment updated',
    payment: payments[paymentIndex]
  });
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
const deletePayment = (req, res) => {
  const paymentIndex = payments.findIndex((p) => p.id === parseInt(req.params.id));

  if (paymentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  payments.splice(paymentIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Payment deleted'
  });
};

module.exports = {
  processPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment
};
