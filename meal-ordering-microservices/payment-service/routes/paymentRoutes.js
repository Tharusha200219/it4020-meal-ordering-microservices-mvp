const express = require('express');
const {
  processPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, processPayment);
router.get('/', authMiddleware, getAllPayments);
router.get('/:id', authMiddleware, getPaymentById);
router.put('/:id', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);

module.exports = router;
