const express = require('express');
const {
  createOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.route('/')
  .get(getOrders)
  .post(createOrder);

router.get('/all', authorize('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);

// Admin only routes
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router; 