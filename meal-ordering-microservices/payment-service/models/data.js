// In-memory payments storage
let payments = [];
let paymentIdCounter = 1;

// Create a new payment
const createPayment = (order_id, amount, payment_method, status) => {
  const payment = {
    id: paymentIdCounter++,
    order_id,
    amount,
    payment_method,
    status,
    created_at: new Date().toISOString(),
  };
  payments.push(payment);
  return payment;
};

// Find payment by order_id
const findPaymentByOrderId = (order_id) => {
  return payments.find((payment) => payment.order_id === order_id);
};

// Find payment by id
const findPaymentById = (id) => {
  return payments.find((payment) => payment.id === id);
};

// Get all payments
const getAllPayments = () => {
  return payments;
};

module.exports = {
  payments,
  createPayment,
  findPaymentByOrderId,
  findPaymentById,
  getAllPayments,
};
